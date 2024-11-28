
import torch

# Ruta al modelo original
MODEL_PATH = r"C:\Users\adria\OneDrive - Instituto Tecnologico y de Estudios Superiores de Monterrey\7mo Sem\LauCows\LauCows\models\trained_fasterrcnn_resnet50.pth"

# Crear el modelo original
from torchvision.models.detection import fasterrcnn_resnet50_fpn
model = fasterrcnn_resnet50_fpn(num_classes=2)
model.load_state_dict(torch.load(MODEL_PATH))

# Guardar únicamente los pesos
ESSENTIAL_WEIGHTS_PATH = r"C:\Users\adria\OneDrive - Instituto Tecnologico y de Estudios Superiores de Monterrey\7mo Sem\LauCows\LauCows\models\essential_weights_fasterrcnn.pth"
torch.save(model.state_dict(), ESSENTIAL_WEIGHTS_PATH)

# Verificar tamaño
import os
print(f"Tamaño de los pesos: {os.path.getsize(ESSENTIAL_WEIGHTS_PATH) / (1024 ** 2):.2f} MB")
