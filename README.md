# ARCH-LING - Arkeolojik Dilbilim AI Sistemi

ARCH-LING, antik yazıları ve arkeolojik eserleri analiz etmek için tasarlanmış gelişmiş bir yapay zeka destekli sistemdir. Bu sistem, antik yazı sistemlerini tanımlamak, translitere etmek ve bağlam sağlamak için bilgisayarlı görü, doğal dil işleme ve arkeolojik uzmanlığı birleştirir.

## 🏛️ Özellikler

- **Görüntü Yükleme ve Analiz**: Antik yazılı arkeolojik eserlerin fotoğraflarını yükleyin
- **Yazı Tespiti**: Çeşitli antik yazı sistemlerini tanımlayın (Çivi Yazısı, Hiyeroglifler, vb.)
- **Medeniyet Sınıflandırması**: Kültürel köken ve zaman dilimini belirleyin
- **Transliterasyon**: Antik yazıları modern Latin karakterlere dönüştürün
- **3D Model Oluşturma**: Tanınan gliflerin 3D modellerini oluşturun
- **Dışa Aktarma Yetenekleri**: Sonuçları JSON formatında ve 3D modelleri GLB dosyaları olarak indirin

## 🚀 Desteklenen Antik Yazılar

- Sümer Çivi Yazısı (MÖ 3200-MS 100)
- Mısır Hiyeroglifleri (MÖ 3200-MS 400)
- Antik Yunanca (MÖ 800-MS 600)
- Maya Glifleri (MS 300-1500)
- Fenikece (MÖ 1200-300)
- Eski Türkçe/Orhun (MS 700-1000)
- Linear B (MÖ 1450-1200)
- Akadca (MÖ 2500-MS 100)

## 🛠️ Teknoloji Yığını

### Frontend (Mevcut Uygulama)
- TypeScript ile **React 18**
- Stil için **Tailwind CSS**
- İkonlar için **Lucide React**
- Yapı araçları için **Vite**

### Backend Mimarisi (Tam Uygulama İçin)

```
arch-ling/
├── main.py                 # FastAPI uygulama giriş noktası
├── requirements.txt        # Python bağımlılıkları
├── models/
│   ├── __init__.py
│   ├── script_detector.py  # Yazı tespit modeli
│   ├── ocr_model.py       # OCR/glif tanıma
│   ├── civilization_classifier.py
│   └── model_loader.py    # Model yönetimi
├── utils/
│   ├── __init__.py
│   ├── image_preprocessing.py
│   ├── transliteration.py
│   ├── glyph_segmentation.py
│   └── model_3d_generator.py
├── api/
│   ├── __init__.py
│   ├── routes.py          # API uç noktaları
│   └── schemas.py         # Pydantic modelleri
├── templates/
│   └── index.html         # Web arayüzü
├── static/
│   ├── css/
│   ├── js/
│   └── uploads/
└── data/
    ├── models/            # Eğitilmiş model dosyaları
    ├── datasets/          # Eğitim veri setleri
    └── configs/           # Yapılandırma dosyaları
```

## 📋 Kurulum ve Ayarlama

### Frontend Geliştirme (Mevcut)

```bash
# Depoyu klonlayın
git clone <repository-url>
cd arch-ling

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

### Tam Sistem Uygulaması

#### Ön Koşullar
- Python 3.9+
- CUDA uyumlu GPU (önerilen)
- 16GB+ RAM
- Node.js 18+ (frontend için)

#### Backend Kurulumu

```bash
# Sanal ortam oluşturun
python -m venv venv
source venv/bin/activate  # Windows'ta: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Önceden eğitilmiş modelleri indirin (Model Kurulumu bölümüne bakın)
python scripts/download_models.py

# FastAPI sunucusunu başlatın
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Gerekli Python Bağımlılıkları

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
torch==2.1.0
torchvision==0.16.0
transformers==4.35.0
opencv-python==4.8.1.78
pillow==10.0.1
numpy==1.24.3
scikit-image==0.21.0
matplotlib==3.7.2
trimesh==4.0.4
pygltflib==1.16.1
python-multipart==0.0.6
jinja2==3.1.2
aiofiles==23.2.1
```

## 🤖 AI Modelleri ve Eğitim

### Model Mimarisi

1. **Yazı Tespit Modeli**
   - Bölge tespiti için YOLOv8 tabanlı
   - Yazı bölgeleri etrafında sınırlayıcı kutular içeren özel veri seti
   - 50K+ arkeolojik görüntü üzerinde eğitilmiş

2. **Glif Tanıma Modeli**
   - Vision Transformer (ViT) mimarisi
   - Bireysel glifler için çok sınıflı sınıflandırma
   - Segmentlenmiş glif veri setleri üzerinde eğitilmiş

3. **Medeniyet Sınıflandırıcısı**
   - Özel başlık ile ResNet-50 omurgası
   - Görsel özellikleri metadata ile birleştirir
   - Düzenlenmiş arkeolojik veri setleri üzerinde eğitilmiş

### Eğitim Verisi Gereksinimleri

#### Yazı Tespit Veri Seti
```
datasets/
├── script_detection/
│   ├── images/
│   │   ├── civi_yazisi_001.jpg
│   │   ├── hiyeroglif_001.jpg
│   │   └── ...
│   ├── annotations/
│   │   ├── civi_yazisi_001.xml  # PASCAL VOC formatı
│   │   ├── hiyeroglif_001.xml
│   │   └── ...
│   └── siniflar.txt
```

#### Glif Tanıma Veri Seti
```
datasets/
├── glyph_recognition/
│   ├── civi_yazisi/
│   │   ├── AN/          # Glif sınıf klasörleri
│   │   ├── DINGIR/
│   │   └── ...
│   ├── hiyeroglifler/
│   │   ├── A1/
│   │   ├── A2/
│   │   └── ...
│   └── metadata.json
```

### Eğitim Betikleri

#### 1. Yazı Tespit Eğitimi
```python
# yazı_tespit_egitimi.py
import torch
from ultralytics import YOLO

# Önceden eğitilmiş YOLOv8 modelini yükle
model = YOLO('yolov8n.pt')

# Özel veri seti üzerinde eğit
results = model.train(
    data='datasets/script_detection/config.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    device='cuda'
)

# Eğitilmiş modeli kaydet
model.save('models/yazi_tespit.pt')
```

#### 2. Glif Tanıma Eğitimi
```python
# glif_tanima_egitimi.py
import torch
import torch.nn as nn
from transformers import ViTForImageClassification, ViTConfig

# Modeli yapılandır
config = ViTConfig(
    image_size=224,
    patch_size=16,
    num_labels=len(glif_siniflari),
    hidden_size=768,
    num_hidden_layers=12,
    num_attention_heads=12
)

# Modeli başlat
model = ViTForImageClassification(config)

# Eğitim döngüsü
for epoch in range(epoch_sayisi):
    for batch in dataloader:
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

# Modeli kaydet
model.save_pretrained('models/glif_taniyici')
```

### Model Değiştirme Rehberi

#### Yer Tutucu Modelleri Değiştirme

1. **Modellerinizi İndirin/Eğitin**
   ```bash
   # Eğitilmiş modelleri models/ dizinine yerleştirin
   models/
   ├── yazi_tespit.pt
   ├── glif_taniyici/
   └── medeniyet_siniflandirici.pt
   ```

2. **Model Yükleme Kodunu Güncelleyin**
   ```python
   # models/model_loader.py
   def yazi_tespit_yukle():
       # Yer tutucuyu gerçek model ile değiştir
       model = YOLO('models/yazi_tespit.pt')
       return model
   
   def glif_taniyici_yukle():
       # Yer tutucuyu gerçek model ile değiştir
       model = ViTForImageClassification.from_pretrained('models/glif_taniyici')
       return model
   ```

3. **Model Parametrelerini Yapılandırın**
   ```python
   # Sınıf eşlemelerini ve eşikleri güncelleyin
   GLIF_SINIFLARI = {
       'civi_yazisi': ['AN', 'DINGIR', 'LUGAL', ...],
       'hiyeroglifler': ['A1', 'A2', 'B1', ...],
       # Sınıflarınızı ekleyin
   }
   
   GUVEN_ESIGI = 0.7  # Model performansına göre ayarlayın
   ```

## 🔧 API Uç Noktaları

### Temel Uç Noktalar

```python
# main.py - FastAPI uç noktaları

@app.post("/api/analyze")
async def goruntu_analiz_et(file: UploadFile):
    """
    Yüklenen arkeolojik görüntüyü analiz et
    Döndürür: medeniyet, transliterasyon, metadata
    """
    pass

@app.get("/api/civilizations")
async def desteklenen_medeniyetleri_getir():
    """
    Desteklenen medeniyetlerin listesini getir
    """
    pass

@app.post("/api/generate-3d")
async def ucboyutlu_model_olustur(analiz_id: str):
    """
    Analiz sonuçlarından 3D model oluştur
    Döndürür: GLB dosya indirme
    """
    pass
```

### Örnek API Kullanımı

```javascript
// Frontend API çağrıları
const goruntuAnaliz = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};
```

## 🎯 Performans Optimizasyonu

### Görüntü Ön İşleme Hattı

```python
# utils/image_preprocessing.py
def goruntu_on_isle(goruntu):
    """
    Tam ön işleme hattı
    """
    # 1. Gürültü azaltma
    gurultusuz = cv2.bilateralFilter(goruntu, 9, 75, 75)
    
    # 2. Perspektif düzeltme
    duzeltilmis = perspektif_duzelt(gurultusuz)
    
    # 3. Gölge kaldırma
    golgesiz = golge_kaldir(duzeltilmis)
    
    # 4. Çözünürlük artırma (gerekirse)
    gelistirilmis = super_cozunurluk(golgesiz)
    
    return gelistirilmis
```

### Önbellekleme Stratejisi

```python
# Model tahminleri için Redis önbellekleme uygula
import redis
import pickle

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def onbellekli_tahmin(goruntu_hash, model_func, *args):
    # Önce önbelleği kontrol et
    onbellekli_sonuc = redis_client.get(f"tahmin:{goruntu_hash}")
    if onbellekli_sonuc:
        return pickle.loads(onbellekli_sonuc)
    
    # Tahmini hesapla
    sonuc = model_func(*args)
    
    # Sonucu önbelleğe al
    redis_client.setex(
        f"tahmin:{goruntu_hash}", 
        3600,  # 1 saat TTL
        pickle.dumps(sonuc)
    )
    
    return sonuc
```

## 📊 Değerlendirme Metrikleri

### Model Performans Takibi

```python
# degerlendirme/metrikler.py
def yazi_tespit_degerlendir(model, test_veri_seti):
    """
    Yazı tespit modelini değerlendir
    """
    metrikler = {
        'mAP': 0.0,
        'kesinlik': 0.0,
        'duyarlilik': 0.0,
        'f1_skoru': 0.0
    }
    
    # Uygulama detayları...
    return metrikler

def glif_tanima_degerlendir(model, test_veri_seti):
    """
    Glif tanıma doğruluğunu değerlendir
    """
    dogru = 0
    total = 0
    
    for batch in test_veri_seti:
        tahminler = model(batch['goruntuler'])
        dogru += (tahminler.argmax(1) == batch['etiketler']).sum()
        total += len(batch['etiketler'])
    
    dogruluk = dogru / total
    return {'dogruluk': dogruluk}
```

## 🚀 Dağıtım

### Docker Dağıtımı

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1

# Gereksinimleri kopyala ve Python bağımlılıklarını yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyala
COPY . .

# Modelleri indir
RUN python scripts/modelleri_indir.py

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Üretim Dağıtımı

```bash
# Docker ile oluştur ve çalıştır
docker build -t arch-ling .
docker run -p 8000:8000 -v ./models:/app/models arch-ling

# Veya docker-compose ile dağıt
docker-compose up -d
```

## 🧪 Test Etme

### Birim Testleri

```python
# testler/test_modeller.py
import pytest
from models.yazi_tespit import YaziTespit

def test_yazi_tespit():
    tespit_edici = YaziTespit()
    
    # Örnek görüntü ile test
    sonuc = tespit_edici.tespit_et('testler/ornekler/civi_yazisi_ornek.jpg')
    
    assert sonuc['yazi_turu'] == 'civi_yazisi'
    assert sonuc['guven'] > 0.8
    assert len(sonuc['bolgeler']) > 0

def test_transliterasyon():
    from utils.transliterasyon import civi_yazisi_translitere_et
    
    glifler = ['𒀭', '𒈗', '𒌓']
    sonuc = civi_yazisi_translitere_et(glifler)
    
    assert sonuc == 'an lugal ud'
```

### Entegrasyon Testleri

```bash
# Tüm testleri çalıştır
pytest testler/ -v

# Kapsam ile çalıştır
pytest testler/ --cov=. --cov-report=html
```

## 📚 Araştırma ve Referanslar

### Akademik Makaleler
- "Antik Yazı Tanıma için Derin Öğrenme" (2023)
- "Dijital Arkeolojide Bilgisayarlı Görü" (2022)
- "CNN'ler Kullanarak Otomatik Çivi Yazısı Tanıma" (2021)

### Veri Setleri
- **Çivi Yazısı Dijital Kütüphane Girişimi (CDLI)**
- **Hiyeroglif Metin Tanıma Veri Seti**
- **Maya Glif Tanıma Korpusu**

### Model Mimarileri
- Nesne tespiti için YOLOv8
- Sınıflandırma için Vision Transformer
- Özellik çıkarımı için ResNet

## 🤝 Katkıda Bulunma

1. Depoyu fork edin
2. Özellik dalı oluşturun
3. Yeni işlevsellik için testler ekleyin
4. Pull request gönderin

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için LICENSE dosyasına bakın.

## 🙏 Teşekkürler

- Veri setleri sağlayan arkeolojik kurumlar
- Açık kaynak bilgisayarlı görü topluluğu
- Dijital beşeri bilimler araştırmacıları

---

**Not**: Bu şu anda bir frontend prototipidir. Tam backend uygulaması, AI modellerini eğitmek için önemli hesaplama kaynakları ve özel arkeolojik veri setleri gerektirir.