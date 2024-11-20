# 
░░░██╗░██╗░  ██╗░░░░░░█████╗░░██╗░░░░░░░██╗░█████╗░░█████╗░░██╗░░░░░░░██╗░██████╗
██████████╗  ██║░░░░░██╔══██╗░██║░░██╗░░██║██╔══██╗██╔══██╗░██║░░██╗░░██║██╔════╝
╚═██╔═██╔═╝  ██║░░░░░███████║░╚██╗████╗██╔╝██║░░╚═╝██║░░██║░╚██╗████╗██╔╝╚█████╗░
██████████╗  ██║░░░░░██╔══██║░░████╔═████║░██║░░██╗██║░░██║░░████╔═████║░░╚═══██╗
╚██╔═██╔══╝  ███████╗██║░░██║░░╚██╔╝░╚██╔╝░╚█████╔╝╚█████╔╝░░╚██╔╝░╚██╔╝░██████╔╝
░╚═╝░╚═╝░░░  ╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░░╚════╝░░╚════╝░░░░╚═╝░░░╚═╝░░╚═════╝░
<br><br>
## <center>![CowWigGIF](https://github.com/user-attachments/assets/0fd770b4-039f-49d1-887e-20f13a3313d9)</center>



## Overview
This project focuses on improving dairy cow productivity and operational efficiency at a dairy farm using advanced technologies. By leveraging computer vision and artificial intelligence, the project aims to monitor cow behavior, optimize milking processes, and improve overall farm profitability.

---

## Business Understanding

### Objectives
- **Increase Dairy Productivity**: Optimize cow rest times, stall usage, and queue efficiency.
- **Enhance Operational Efficiency**: Use data insights to reduce costs and improve milking automation.
- **Cow Welfare**: Ensure cow comfort by monitoring activity and environment.

### Challenges
1. **Inefficient Energy Usage**: Long queue times reduce productivity.
2. **Stall Monitoring**: Lack of precise data on stall usage and rest times.
3. **Milking Optimization**: Automated milking lacks readiness assessments and queue time optimization.

---

## CRISP-DM Methodology
### Phases:
1. **Business Understanding**: Define goals and align with business objectives.
2. **Data Understanding**: Assess data quality and challenges.
3. **Data Preparation**: Preprocess images and organize datasets.
4. **Modeling**: Train and evaluate machine learning models.
5. **Evaluation**: Validate against business and data mining objectives.
6. **Deployment**: Implement real-time solutions.

---

## Modeling

### Selected Technique: YOLOv8
- **Architecture Highlights**:
  - Optimized for object detection.
  - Anchor-free design for simplicity.
  - Advanced data augmentation (e.g., random cropping, mosaics).
  - Tailored loss function for bounding boxes, classification, and object detection.

### Dataset:
- **Size**: 8,087 images.
- **Split**: 
  - 80% training.
  - 20% validation.
  - Subdivided into **daytime** and **nighttime** conditions.

### Training & Results
| Model           | Dataset       | Precision | Recall | mAP@50 | mAP@50-95 |
|------------------|---------------|-----------|--------|---------|------------|
| Hybrid Model     | Day + Night   | 95.00%    | 95.00% | 96.00%  | 84.00%     |
| Daytime Model    | Day Only      | 96.00%    | 96.00% | 98.00%  | 87.00%     |
| Nighttime Model  | Night Only    | 92.00%    | 92.00% | 95.00%  | 71.00%     |

- **Hybrid Model**: Balanced accuracy for mixed conditions.
- **Daytime Model**: Best performance under natural light.
- **Nighttime Model**: Moderate success but limited by low-light challenges.

---

## Deployment

### Implementation Plan:
- **Hardware**:
  - Raspberry Pi 3 for real-time detection.
  - Gaming laptops with GPUs (NVIDIA GTX960M, GeForce RTX) for training.
- **Software**:
  - **TensorFlow** and **PyTorch** for model development.
  - **Roboflow**, **Labelme**, and **LabelGPT** for data labeling.
- **Cloud Storage**:
  - Google Drive for storing datasets and project files.

---

## Evaluation

### Metrics:
- **Precision**: Measures correct predictions.
- **Recall**: Measures detection of all objects.
- **mAP@50-95**: Evaluates overall model quality.

### Summary:
- **Daytime Model**: Highly effective for daytime conditions.
- **Nighttime Model**: Less robust due to limited nighttime data.
- **Hybrid Model**: Balanced, suitable for mixed conditions.


---

## Contributors
- Adrián Matute
- Pablo Martínez
- Osvaldo Del Valle
- Andrés Callealta
- Jorge Martínez

**Institution**: Tecnológico de Monterrey, Campus Querétaro, México
