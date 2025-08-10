#!/usr/bin/env bash
# READY-TO-APPLY.sh — Depth Email System Implementation
# ⚠️  جميع الأوامر معلّقة ولا تُشغّل بدون موافقة صريحة من المالك

DOMAIN="depth-agency.com"
ADMIN="admin@depth-agency.com"

# ==========================
# Phase 1: Workspace Settings
# ==========================

# تفعيل Collaborative Inbox
# gam update group hello@${DOMAIN} settings enableCollaborativeInbox true
# gam update group support@${DOMAIN} settings enableCollaborativeInbox true

# ضبط سياسات الرد للمجموعات الداخلية
# gam update group billing@${DOMAIN} replyTo REPLY_TO_MANAGERS allowExternalMembers false
# gam update group invoices@${DOMAIN} replyTo REPLY_TO_MANAGERS allowExternalMembers false
# gam update group legal@${DOMAIN} replyTo REPLY_TO_MANAGERS allowExternalMembers false
# gam update group studio@${DOMAIN} replyTo REPLY_TO_MANAGERS allowExternalMembers false

# سياسات الرد للمجموعات الخارجية
# gam update group hello@${DOMAIN} replyTo REPLY_TO_SENDER allowExternalMembers true
# gam update group sales@${DOMAIN} replyTo REPLY_TO_SENDER allowExternalMembers true
# gam update group support@${DOMAIN} replyTo REPLY_TO_SENDER allowExternalMembers true
# gam update group press@${DOMAIN} replyTo REPLY_TO_SENDER allowExternalMembers true

# مجموعة الوظائف مع الإشراف
# gam update group jobs@${DOMAIN} replyTo REPLY_TO_SENDER allowExternalMembers true messageModerationLevel MODERATE_ALL_MESSAGES

# ==========================
# Phase 2: Smart Contact Routing
# ==========================

# تعديل ملف route.ts لإضافة التوجيه الذكي
# إضافة dropdown في نموذج التواصل
# ربط نموذج الحجز بـ API
# اختبار ونشر التحديثات

# ==========================  
# Phase 3: Email Templates
# ==========================

# تفعيل قوالب الرد التلقائي في Google Workspace
# إضافة رقم واتساب: [TO_BE_ADDED_BY_OWNER]
# Templates موجودة في: audits/email_templates/

# ==========================
# Phase 4: DMARC Upgrade  
# ==========================

# مراقبة تقارير DMARC لمدة أسبوعين
# gam user ${ADMIN} print messages query "from:noreply-dmarc-support@google.com"

# ترقية DMARC إلى p=reject بعد التأكد:
# DNS TXT _dmarc.${DOMAIN}: 
# v=DMARC1; p=reject; rua=mailto:dmarc@depth-agency.com; fo=1; pct=100

# ==========================
# Backout Plans
# ==========================

# إلغاء Collaborative Inbox:
# gam update group hello@${DOMAIN} settings enableCollaborativeInbox false

# إعادة سياسات الرد:
# for g in hello sales support press billing invoices legal studio jobs; do
#   gam update group ${g}@${DOMAIN} replyTo REPLY_TO_SENDER
# done

# إعادة DMARC للـ quarantine:
# v=DMARC1; p=quarantine; rua=mailto:dmarc@depth-agency.com; fo=1; pct=100

echo "تم — كل الأوامر معلّقة ✅ بانتظار موافقة المالك للتنفيذ"