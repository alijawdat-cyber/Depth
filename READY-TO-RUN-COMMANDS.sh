#!/usr/bin/env bash
# Ready-to-Run Commands - Depth Agency System Management
# تاريخ الإنشاء: 10 أغسطس 2025

set -euo pipefail

DOMAIN=${DOMAIN:-"depth-agency.com"}
PRIMARY_ADMIN=${PRIMARY_ADMIN:-"admin@depth-agency.com"}

echo "🚀 Depth Agency - Ready-to-Run Commands"
echo "========================================="

# 1) إضافة أعضاء جدد للمجموعات
add_team_member() {
    local email="$1"
    local role="${2:-member}"  # member, manager, owner
    
    echo "📧 Adding $email as $role to all relevant groups..."
    
    # المجموعات العامة
    gam update group hello@$DOMAIN add $role user $email
    gam update group sales@$DOMAIN add $role user $email
    gam update group support@$DOMAIN add $role user $email
    
    # المجموعات الداخلية (اختياري)
    read -p "Add to internal groups (studio/billing)? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gam update group studio@$DOMAIN add $role user $email
        gam update group billing@$DOMAIN add $role user $email
        gam update group invoices@$DOMAIN add $role user $email
        echo "✅ Added to internal groups"
    fi
    
    echo "✅ Team member $email added successfully"
}

# 2) فحص حالة جميع المجموعات
check_groups_status() {
    echo "📊 Checking all groups status..."
    
    for group in hello sales support press jobs billing invoices legal studio; do
        echo "--- ${group}@$DOMAIN ---"
        gam info group ${group}@$DOMAIN | head -15
        echo
    done
}

# 3) فحص تقارير DMARC
check_dmarc_reports() {
    echo "📈 Checking DMARC reports..."
    gam user $PRIMARY_ADMIN print messages query "from:noreply-dmarc-support@google.com" maxResults 10
}

# 4) تحديث DMARC إلى reject (بعد فترة مراقبة)
update_dmarc_to_reject() {
    echo "⚠️  WARNING: This will update DMARC policy to p=reject"
    echo "Only run this after monitoring reports for 2+ weeks"
    read -p "Are you sure? Type 'CONFIRM' to proceed: " confirmation
    
    if [ "$confirmation" = "CONFIRM" ]; then
        echo "🔒 Updating DMARC policy to p=reject..."
        echo "Add this TXT record for _dmarc.$DOMAIN in DNS:"
        echo "v=DMARC1; p=reject; rua=mailto:dmarc@$DOMAIN; fo=1; pct=100; adkim=s; aspf=s; sp=reject"
        echo "⚠️  Apply this change in Squarespace Domains DNS settings"
    else
        echo "❌ DMARC update cancelled"
    fi
}

# 5) إنشاء alias جديد
create_alias() {
    local alias_name="$1"
    local target_user="$2"
    
    echo "📨 Creating alias ${alias_name}@$DOMAIN → $target_user"
    gam create alias ${alias_name}@$DOMAIN user $target_user
    echo "✅ Alias created successfully"
}

# 6) نسخ احتياطي من إعدادات المجموعات
backup_group_settings() {
    echo "💾 Creating backup of all group settings..."
    
    mkdir -p backups/$(date +%Y%m%d)
    
    for group in hello sales support press jobs billing invoices legal studio; do
        gam info group ${group}@$DOMAIN > "backups/$(date +%Y%m%d)/${group}-settings.txt"
    done
    
    gam print groups > "backups/$(date +%Y%m%d)/all-groups.csv"
    gam print group-members > "backups/$(date +%Y%m%d)/all-members.csv"
    
    echo "✅ Backup saved to backups/$(date +%Y%m%d)/"
}

# 7) اختبار إرسال إيميل
test_email_delivery() {
    local test_group="${1:-hello@$DOMAIN}"
    echo "✉️  Testing email delivery to $test_group"
    echo "Send a test email manually and check delivery"
    echo "Monitor with: gam user $PRIMARY_ADMIN print messages query 'from:$test_group'"
}

# 8) عرض الاستخدام والمساعدة
show_help() {
    cat << 'EOF'
🎯 Depth Agency - Command Reference

Available Functions:
  add_team_member <email> [role]    - إضافة عضو فريق جديد
  check_groups_status               - فحص حالة جميع المجموعات  
  check_dmarc_reports              - مراجعة تقارير DMARC
  update_dmarc_to_reject           - تحديث DMARC إلى p=reject
  create_alias <name> <target>     - إنشاء alias جديد
  backup_group_settings            - نسخ احتياطي للإعدادات
  test_email_delivery [group]      - اختبار التسليم
  show_help                        - عرض هذه المساعدة

Examples:
  add_team_member designer@depth-agency.com manager
  create_alias pr press@depth-agency.com
  test_email_delivery sales@depth-agency.com

Domain: $DOMAIN
Admin: $PRIMARY_ADMIN

⚠️  Ensure GAM is properly authenticated before running commands
EOF
}

# التنفيذ الرئيسي
main() {
    case "${1:-help}" in
        "add_member"|"add")
            add_team_member "${2:-}" "${3:-member}"
            ;;
        "check"|"status")
            check_groups_status
            ;;
        "dmarc"|"reports")
            check_dmarc_reports
            ;;
        "dmarc_reject"|"reject")
            update_dmarc_to_reject
            ;;
        "alias")
            create_alias "${2:-}" "${3:-}"
            ;;
        "backup")
            backup_group_settings
            ;;
        "test")
            test_email_delivery "${2:-}"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# تشغيل إذا كان الملف منفذ مباشرة
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

echo ""
echo "🎉 Commands ready! Use: bash $(basename $0) help"
