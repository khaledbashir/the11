-- Social Garden SOW Generator - Complete Database Schema
-- This schema replaces localStorage with MySQL for zero data loss

USE socialgarden_sow;

-- ============================================
-- FOLDERS TABLE - Client folders
-- ============================================
CREATE TABLE IF NOT EXISTS folders (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  anythingllm_workspace_slug VARCHAR(255),
  INDEX idx_workspace_slug (anythingllm_workspace_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DOCUMENTS TABLE - SOW documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  folder_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  total_investment DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
  INDEX idx_folder (folder_id),
  INDEX idx_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- AGENTS TABLE - AI agents configuration
-- ============================================
CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  system_prompt TEXT NOT NULL,
  model VARCHAR(255) NOT NULL DEFAULT 'z-ai/glm-4.5-air:free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CHAT_MESSAGES TABLE - Agent chat history
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  agent_id VARCHAR(36) NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content LONGTEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  INDEX idx_agent_timestamp (agent_id, timestamp),
  INDEX idx_agent_created (agent_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER_PREFERENCES TABLE - App settings
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  preference_key VARCHAR(100) UNIQUE NOT NULL,
  preference_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default preferences
INSERT INTO user_preferences (preference_key, preference_value) VALUES
  ('current_document_id', NULL),
  ('current_agent_id', NULL),
  ('guided_setup_completed', 'false'),
  ('tutorial_completed', 'false')
ON DUPLICATE KEY UPDATE preference_value = preference_value;

-- ============================================
-- Verify schema
-- ============================================
SELECT 'Schema created successfully!' as Status;
SHOW TABLES;
