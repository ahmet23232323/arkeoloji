/*
  # ARCH-LING Arkeolojik Dilbilim Sistemi - Veritabanı Şeması

  1. Yeni Tablolar
    - `ancient_scripts`
      - `id` (uuid, primary key) - Benzersiz kimlik
      - `name` (text) - Dilin adı (Sümer Çivi Yazısı, vb.)
      - `code` (text) - Dil kodu (sumerian, egyptian, vb.)
      - `period` (text) - Dönem bilgisi (MÖ 3200-MS 100)
      - `region` (text) - Bölge (Mezopotamya, Mısır, vb.)
      - `description` (text) - Açıklama
      - `created_at` (timestamptz) - Oluşturulma tarihi
    
    - `translations`
      - `id` (uuid, primary key) - Benzersiz kimlik
      - `user_id` (uuid) - Kullanıcı ID (auth.users referansı)
      - `image_url` (text) - Yüklenen görüntü URL'si
      - `script_id` (uuid) - Tespit edilen antik yazı (ancient_scripts referansı)
      - `original_text` (text) - Orijinal metin (tespit edilen)
      - `translated_text` (text) - Türkçe çeviri
      - `confidence_score` (decimal) - Güven skoru (0-100)
      - `analysis_data` (jsonb) - AI analiz detayları
      - `is_public` (boolean) - Paylaşıma açık mı
      - `created_at` (timestamptz) - Oluşturulma tarihi
      - `updated_at` (timestamptz) - Güncellenme tarihi
    
    - `comments`
      - `id` (uuid, primary key) - Benzersiz kimlik
      - `translation_id` (uuid) - İlgili çeviri (translations referansı)
      - `user_id` (uuid) - Yorum yapan kullanıcı (auth.users referansı)
      - `content` (text) - Yorum içeriği
      - `created_at` (timestamptz) - Oluşturulma tarihi
      - `updated_at` (timestamptz) - Güncellenme tarihi

  2. Güvenlik
    - Her tablo için RLS etkinleştirildi
    - Kullanıcılar kendi çevirilerini görebilir ve düzenleyebilir
    - Paylaşıma açık çeviriler herkes tarafından görülebilir
    - Yorumlar herkes tarafından okunabilir, sadece sahibi silebilir
    - Antik yazı veritabanı herkes tarafından okunabilir
*/

-- Ancient Scripts Table
CREATE TABLE IF NOT EXISTS ancient_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  period text NOT NULL,
  region text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ancient_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ancient scripts"
  ON ancient_scripts FOR SELECT
  TO public
  USING (true);

-- Translations Table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  script_id uuid REFERENCES ancient_scripts(id) ON DELETE SET NULL,
  original_text text DEFAULT '',
  translated_text text DEFAULT '',
  confidence_score decimal(5,2) DEFAULT 0,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own translations"
  ON translations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public translations"
  ON translations FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Users can insert own translations"
  ON translations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own translations"
  ON translations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own translations"
  ON translations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id uuid REFERENCES translations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments on public translations"
  ON comments FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM translations
      WHERE translations.id = comments.translation_id
      AND translations.is_public = true
    )
  );

CREATE POLICY "Users can view comments on own translations"
  ON comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM translations
      WHERE translations.id = comments.translation_id
      AND translations.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert Ancient Scripts Data
INSERT INTO ancient_scripts (name, code, period, region, description) VALUES
  ('Sümer Çivi Yazısı', 'sumerian', 'MÖ 3200-MS 100', 'Mezopotamya', 'Dünyanın bilinen en eski yazı sistemlerinden biri. Kil tabletler üzerine çivi biçimli işaretlerle yazılmıştır.'),
  ('Mısır Hiyeroglifleri', 'egyptian', 'MÖ 3200-MS 400', 'Mısır', 'Antik Mısırda kullanılan resim ve sembol tabanlı yazı sistemi.'),
  ('Antik Yunanca', 'ancient_greek', 'MÖ 800-MS 600', 'Akdeniz', 'Klasik dönem Yunan medeniyetinin yazı sistemi.'),
  ('Maya Glifleri', 'mayan', 'MS 300-1500', 'Mezoamerika', 'Maya medeniyetinin logosilabik yazı sistemi.'),
  ('Fenikece', 'phoenician', 'MÖ 1200-300', 'Akdeniz', 'Modern alfabenin atasıdır. Akdeniz ticaretinde yaygın kullanılmıştır.'),
  ('Eski Türkçe (Orhun)', 'old_turkic', 'MS 700-1000', 'Orta Asya', 'Göktürk alfabesi olarak da bilinir. Orhun Anıtlarında kullanılmıştır.'),
  ('Linear B', 'linear_b', 'MÖ 1450-1200', 'Yunanistan/Girit', 'Miken Yunancasını yazmak için kullanılan hece yazısı.'),
  ('Akadca', 'akkadian', 'MÖ 2500-MS 100', 'Mezopotamya', 'Çivi yazısıyla yazılan Sami dil ailesi mensubu antik dil.')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON translations(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_script_id ON translations(script_id);
CREATE INDEX IF NOT EXISTS idx_translations_is_public ON translations(is_public);
CREATE INDEX IF NOT EXISTS idx_comments_translation_id ON comments(translation_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
