import os
import torch
import cv2
import random
import torchvision
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torch.utils.data import DataLoader, Subset
from torchvision.transforms import functional as F
from pycocotools.coco import COCO
from pycocotools.cocoeval import COCOeval
import torchvision.transforms as T
from tqdm import tqdm
import matplotlib.pyplot as plt

# Rutas
IMG_DIR = r"G:\Shared drives\CNN_COW_CAETEC\DATASET\YoloCowsV2\images"
ANN_FILE = r"G:\Shared drives\CNN_COW_CAETEC\DATASET\YoloCowsV2\labels_coco\annotations.json"
OUTPUT_DIR = r"C:\Users\adria\OneDrive - Instituto Tecnologico y de Estudios Superiores de Monterrey\7mo Sem\LauCows\LauCows\models\rcnn"

# Dataset personalizado COCO
class CocoDataset(torch.utils.data.Dataset):
    def __init__(self, img_dir, ann_file, transforms=None):
        self.img_dir = img_dir
        self.coco = COCO(ann_file)
        self.img_ids = list(self.coco.imgs.keys())
        self.transforms = transforms or T.Compose([T.ToTensor()])

    def __len__(self):
        return len(self.img_ids)

    def __getitem__(self, idx):
        img_id = self.img_ids[idx]
        ann_ids = self.coco.getAnnIds(imgIds=img_id)
        anns = self.coco.loadAnns(ann_ids)
        img_info = self.coco.loadImgs(img_id)[0]

        # Cargar imagen
        img_path = os.path.join(self.img_dir, img_info['file_name'])
        img = cv2.imread(img_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Crear bounding boxes y etiquetas
        boxes, labels = [], []
        for ann in anns:
            x_min, y_min, width, height = ann['bbox']
            x_max = x_min + width
            y_max = y_min + height
            boxes.append([x_min, y_min, x_max, y_max])
            labels.append(ann['category_id'])

        # Omitir imágenes sin anotaciones
        if len(boxes) == 0:
            return self.__getitem__((idx + 1) % len(self.img_ids))

        boxes = torch.as_tensor(boxes, dtype=torch.float32)
        labels = torch.as_tensor(labels, dtype=torch.int64)
        target = {"boxes": boxes, "labels": labels, "image_id": torch.tensor([img_id])}

        # Aplicar transformaciones
        img = self.transforms(img)
        return img, target

# Crear divisiones de entrenamiento y validación
def split_dataset(dataset, split_ratio=0.8):
    total_size = len(dataset)
    indices = list(range(total_size))
    random.shuffle(indices)

    train_size = int(split_ratio * total_size)
    train_indices = indices[:train_size]
    val_indices = indices[train_size:]

    train_set = Subset(dataset, train_indices)
    val_set = Subset(dataset, val_indices)

    return train_set, val_set

# Modelo Faster R-CNN con ResNet-50
def create_model(num_classes):
    model = fasterrcnn_resnet50_fpn(weights="DEFAULT", box_score_thresh=0.5)
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = torchvision.models.detection.faster_rcnn.FastRCNNPredictor(in_features, num_classes)
    return model

# Entrenar el modelo
def train_model(model, dataloader, optimizer, device, epochs):
    model.train()
    losses_per_epoch = []
    for epoch in range(epochs):
        print(f"Epoch {epoch + 1}/{epochs}")
        epoch_loss = 0
        progress_bar = tqdm(dataloader, desc=f"Epoch {epoch + 1}/{epochs}", unit="batch")
        for images, targets in progress_bar:
            images = [img.to(device) for img in images]
            targets = [{k: v.to(device) for k, v in t.items()} for t in targets]

            # Calcular pérdida
            loss_dict = model(images, targets)
            losses = sum(loss for loss in loss_dict.values())
            epoch_loss += losses.item()

            optimizer.zero_grad()
            losses.backward()
            optimizer.step()

            progress_bar.set_postfix(loss=losses.item())
        losses_per_epoch.append(epoch_loss / len(dataloader))
    return losses_per_epoch

# Evaluar el modelo y calcular métricas
def evaluate_model(model, dataloader, coco, device):
    model.eval()
    coco_results = []

    with torch.no_grad():
        for images, targets in tqdm(dataloader, desc="Evaluating"):
            images = [img.to(device) for img in images]
            outputs = model(images)

            for target, output in zip(targets, outputs):
                boxes = output['boxes'].cpu().numpy()
                scores = output['scores'].cpu().numpy()
                labels = output['labels'].cpu().numpy()
                image_id = int(target["image_id"].item())
                for box, score, label in zip(boxes, scores, labels):
                    x_min, y_min, x_max, y_max = box
                    coco_results.append({
                        "image_id": image_id,
                        "category_id": int(label),
                        "bbox": [x_min, y_min, x_max - x_min, y_max - y_min],
                        "score": float(score),
                    })

    coco_dt = coco.loadRes(coco_results)
    coco_eval = COCOeval(coco, coco_dt, iouType="bbox")
    coco_eval.evaluate()
    coco_eval.accumulate()
    coco_eval.summarize()

    return coco_eval.stats

# Main
def main():
    # Configuración
    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    dataset = CocoDataset(IMG_DIR, ANN_FILE)
    train_set, val_set = split_dataset(dataset, split_ratio=0.8)

    train_loader = DataLoader(train_set, batch_size=4, shuffle=True, collate_fn=lambda x: tuple(zip(*x)))
    val_loader = DataLoader(val_set, batch_size=4, shuffle=False, collate_fn=lambda x: tuple(zip(*x)))

    model = create_model(num_classes=2)
    model.to(device)

    optimizer = torch.optim.SGD(model.parameters(), lr=0.005, momentum=0.9, weight_decay=0.0005)

    losses = train_model(model, train_loader, optimizer, device, epochs=10)
    torch.save(model.state_dict(), os.path.join(OUTPUT_DIR, "trained_fasterrcnn_resnet50.pth"))

    coco = dataset.coco
    metrics = evaluate_model(model, val_loader, coco, device)
    print(f"mAP@50: {metrics[1]:.4f}, mAP@50-95: {metrics[0]:.4f}")

if __name__ == "__main__":
    main()
