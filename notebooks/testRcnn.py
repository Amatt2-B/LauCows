import os
import random
import torch
import torchvision
import cv2
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from torchvision.transforms import functional as F

# Ruta al modelo y directorio de imágenes
MODEL_PATH = "trained_fasterrcnn_resnet50.pth"  # Cambia por el nombre de tu archivo .pth
TEST_IMAGE_DIR = r"G:\Shared drives\CNN_COW_CAETEC\DATASET\YoloCowsDay\valid\images"

# Configuración del dispositivo
device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")

# Crear el modelo Faster R-CNN con ResNet-50
def create_model(num_classes):
    model = torchvision.models.detection.fasterrcnn_resnet50_fpn(weights="DEFAULT")
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = torchvision.models.detection.faster_rcnn.FastRCNNPredictor(in_features, num_classes)
    return model

# Cargar el modelo entrenado
model = create_model(num_classes=2)  # 1 clase (vacas) + fondo
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# Función para mostrar las predicciones
def display_predictions(image, predictions):
    fig, ax = plt.subplots(1, figsize=(12, 8))
    ax.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    for box, score in zip(predictions["boxes"], predictions["scores"]):
        box = box.cpu().numpy()  
        if score >= 0.5:  # Umbral de confianza (ajústalo si es necesario)
            x_min, y_min, x_max, y_max = box
            rect = patches.Rectangle((x_min, y_min), x_max - x_min, y_max - y_min, linewidth=2, edgecolor="r", facecolor="none")
            ax.add_patch(rect)
            ax.text(x_min, y_min - 10, f"{score:.2f}", color="red", fontsize=12, bbox=dict(facecolor="yellow", alpha=0.5))
    plt.axis("off")
    plt.show()

# Obtener las imágenes de prueba
if not os.path.isdir(TEST_IMAGE_DIR):
    raise NotADirectoryError(f"La ruta {TEST_IMAGE_DIR} no es un directorio válido.")

test_images = [os.path.join(TEST_IMAGE_DIR, f) for f in os.listdir(TEST_IMAGE_DIR) if f.endswith(('.png', '.jpg', '.jpeg'))]

if not test_images:
    raise FileNotFoundError(f"No se encontraron imágenes en el directorio {TEST_IMAGE_DIR}.")

# Seleccionar 10 imágenes aleatorias
random_images = random.sample(test_images, min(10, len(test_images)))

# Procesar cada imagen seleccionada
for img_path in random_images:
    print(f"Procesando: {img_path}")
    img = cv2.imread(img_path)
    if img is None:
        print(f"No se pudo cargar la imagen: {img_path}")
        continue

    # Preprocesar la imagen
    img_tensor = F.to_tensor(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)).unsqueeze(0).to(device)

    # Hacer predicciones
    with torch.no_grad():
        outputs = model(img_tensor)
    
    predictions = outputs[0]
    display_predictions(img, predictions)
