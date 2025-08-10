#!/usr/bin/env bash
set -euo pipefail

# Google Workspace Groups bootstrap using GAM (https://github.com/GAM-team/GAMADV-XTD3)
# Requirements:
# 1) Install GAMADV-XTD3 and authorize a Workspace Admin with required scopes
# 2) Run this script: bash scripts/workspace-groups-setup.sh

DOMAIN=${DOMAIN:-"depth-agency.com"}
PRIMARY_ADMIN=${PRIMARY_ADMIN:-"admin@depth-agency.com"}

need_gam() {
  if ! command -v gam >/dev/null 2>&1; then
    echo "[ERROR] 'gam' not found. Install GAMADV-XTD3 first and authorize." >&2
    echo "        Docs: https://github.com/GAM-team/GAMADV-XTD3#installation" >&2
    exit 1;
  fi
}

create_group() {
  local email="$1"; shift
  local name="$1"; shift
  local description="$1"; shift

  echo "\n==> Creating group: ${email}"
  gam create group "${email}" name "${name}" description "${description}" || true

  # Ensure admin as owner
  gam update group "${email}" add owner user "${PRIMARY_ADMIN}" || true
}

configure_group_settings() {
  local email="$1"; shift
  local whoCanPost="$1"; shift         # e.g. ANYONE_CAN_POST | ALL_MEMBERS_CAN_POST
  local moderation="$1"; shift          # e.g. MODERATE_NONE | MODERATE_ALL_MESSAGES
  local allowExternal="$1"; shift       # true|false

  gam update group settings "${email}" \
    whoCanPostMessage "${whoCanPost}" \
    moderationLevel "${moderation}" \
    allowExternalMembers "${allowExternal}" \
    whoCanViewGroup "ALL_MEMBERS_CAN_VIEW" \
    whoCanViewMembership "ALL_MANAGERS_CAN_VIEW" \
    replyTo "REPLY_TO_SENDER" || true
}

main() {
  need_gam

  declare -A GROUPS
  GROUPS[sales@${DOMAIN}]="Sales|المبيعات والمتابعة"
  GROUPS[support@${DOMAIN}]="Support|استفسارات عامة ودعم"
  GROUPS[billing@${DOMAIN}]="Billing|محاسبة ومدفوعات"
  GROUPS[invoices@${DOMAIN}]="Invoices|استلام/إرسال فواتير"
  GROUPS[studio@${DOMAIN}]="Studio|الإنتاج الداخلي"
  GROUPS[jobs@${DOMAIN}]="Jobs|طلبات التوظيف"
  GROUPS[press@${DOMAIN}]="Press|الإعلام والعلاقات العامة"
  GROUPS[legal@${DOMAIN}]="Legal|الشؤون القانونية"
  GROUPS[hello@${DOMAIN}]="Hello|الواجهة العامة"

  for email in "${!GROUPS[@]}"; do
    IFS='|' read -r name desc <<<"${GROUPS[$email]}"
    create_group "$email" "$name" "$desc"
  done

  # Open posting to external senders for public-facing addresses, with sane defaults
  configure_group_settings "hello@${DOMAIN}"   ANYONE_CAN_POST MODERATE_NONE true
  configure_group_settings "sales@${DOMAIN}"   ANYONE_CAN_POST MODERATE_NONE true
  configure_group_settings "support@${DOMAIN}" ANYONE_CAN_POST MODERATE_NONE true
  configure_group_settings "press@${DOMAIN}"   ANYONE_CAN_POST MODERATE_NONE true

  # Tighter policies for sensitive groups
  configure_group_settings "jobs@${DOMAIN}"     ANYONE_CAN_POST MODERATE_ALL_MESSAGES true
  configure_group_settings "billing@${DOMAIN}"  ALL_MEMBERS_CAN_POST MODERATE_NONE false
  configure_group_settings "invoices@${DOMAIN}" ALL_MEMBERS_CAN_POST MODERATE_NONE false
  configure_group_settings "legal@${DOMAIN}"    ALL_MEMBERS_CAN_POST MODERATE_NONE false
  configure_group_settings "studio@${DOMAIN}"   ALL_MEMBERS_CAN_POST MODERATE_NONE false

  echo "\nDone. Review memberships and add teammates as 'Manager/Owner/Member' as needed, e.g.:"
  echo "  gam update group sales@${DOMAIN} add member user teammate@${DOMAIN}"
}

main "$@"


