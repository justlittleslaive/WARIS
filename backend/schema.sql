CREATE TABLE IF NOT EXISTS profiles (
  id TINYINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT '',
  legal_track ENUM('muslim', 'non-muslim', 'native-customary', 'unsure') NOT NULL DEFAULT 'unsure',
  state VARCHAR(32) NULL,
  language ENUM('ms', 'en') NOT NULL DEFAULT 'ms',
  reviewed_documents TINYINT(1) NOT NULL DEFAULT 0,
  reviewed_planning TINYINT(1) NOT NULL DEFAULT 0,
  reviewed_emergency TINYINT(1) NOT NULL DEFAULT 0,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT chk_profiles_singleton CHECK (id = 1),
  CONSTRAINT chk_profiles_native_state CHECK (
    legal_track <> 'native-customary' OR state IN ('Sabah', 'Sarawak')
  )
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS assets (
  id CHAR(36) NOT NULL,
  profile_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  name VARCHAR(120) NOT NULL,
  category ENUM(
    'Bank Savings',
    'Property',
    'Investments (ASB, unit trust, shares)',
    'EPF / KWSP',
    'Insurance / Takaful',
    'Business Interest',
    'Cash, Gold and Jewellery',
    'Vehicle',
    'Other'
  ) NOT NULL,
  institution VARCHAR(120) NOT NULL DEFAULT '',
  estimated_value BIGINT UNSIGNED NOT NULL,
  document_location VARCHAR(200) NOT NULL DEFAULT '',
  notes VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_assets_profile (profile_id),
  CONSTRAINT fk_assets_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
  CONSTRAINT chk_assets_value CHECK (estimated_value <= 1000000000000)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS contacts (
  id CHAR(36) NOT NULL,
  profile_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  name VARCHAR(120) NOT NULL,
  relationship ENUM('Spouse', 'Child', 'Parent', 'Sibling', 'Relative', 'Other') NOT NULL,
  phone VARCHAR(30) NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_contacts_profile (profile_id),
  CONSTRAINT fk_contacts_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
) ENGINE = InnoDB;

INSERT INTO profiles (id, updated_at) VALUES (1, UTC_TIMESTAMP(3)) ON DUPLICATE KEY UPDATE id = id;
