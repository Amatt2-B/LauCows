
██╗░░░░░░█████╗░██╗░░░██╗░█████╗░░█████╗░░██╗░░░░░░░██╗░██████╗
██║░░░░░██╔══██╗██║░░░██║██╔══██╗██╔══██╗░██║░░██╗░░██║██╔════╝
██║░░░░░███████║██║░░░██║██║░░╚═╝██║░░██║░╚██╗████╗██╔╝╚█████╗░
██║░░░░░██╔══██║██║░░░██║██║░░██╗██║░░██║░░████╔═████║░░╚═══██╗
███████╗██║░░██║╚██████╔╝╚█████╔╝╚█████╔╝░░╚██╔╝░╚██╔╝░██████╔╝
╚══════╝╚═╝░░╚═╝░╚═════╝░░╚════╝░░╚════╝░░░░╚═╝░░░╚═╝░░╚═════╝░
<br><br>

## <center>![CowBulklifeGIF](https://github.com/user-attachments/assets/33c7bdb2-0288-448f-85b6-5b21ab23f06b)</center>
---
## Contributors
- **Jorge Martínez López** ([a01704518@tec.mx](mailto:a01704518@tec.mx))
- **Adrián Matute Beltrán** ([a01703889@tec.mx](mailto:a01703889@tec.mx))
- **Andres Callealta** ([a01763701@tec.mx](mailto:a01763701@tec.mx))
- **José Pablo Martínez Valdivia** ([a01275676@tec.mx](mailto:a01275676@tec.mx))
- **Osvaldo Del Valle Mejía** ([a01275702@tec.mx](mailto:a01275702@tec.mx))
---
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

## Evaluation

### Metrics:
- **Precision**: Measures correct predictions.
- **Recall**: Measures detection of all objects.
- **mAP@50-95**: Evaluates overall model quality.

### Summary:
- **Daytime Model**: Highly effective for daytime conditions.
- **Nighttime Model**: Less robust due to limited nighttime data.
- **Hybrid Model**: Balanced, suitable for mixed conditions.


## Dashboard
- **Daily Monitoring:**
  - Visualizes cow counts every five minutes.
  - Issues alerts for peak congestion and calculates time to reduce queue to two cows.
- **Heatmap Analysis:**
  - Displays cow distribution trends.
  - Adjustable for specific date ranges.

---

## Key Results
- **Hybrid Model Performance:**
  - Effective in variable lighting conditions.
  - Detects cattle with minimal error (~5%).
  - Consistently identifies behavior patterns across diverse scenarios.

- **Operational Insights:**
  - Peak activity observed between 6:00 AM and 1:00 PM.
  - Low activity recorded from 9:00 PM to 5:00 AM.
  - Enables timely interventions to reduce queue congestion.

---

## Future Directions
1. Expand dataset by incorporating images from various ranches.
2. Improve generalization capabilities for diverse operational environments.


---


**Institution**: Tecnológico de Monterrey, Campus Querétaro, México
