# مصفوفة موحّدة — Roles × Modules

| Module / Action | Admin | Client | Creator | Employee |
|---|---:|---:|---:|---:|
| Catalog (CRUD/Publish/Versions) | Full | - | - | - |
| Pricing (Rate Card/FX/Modifiers) | Full | - | - | - |
| Projects (CRUD) | Full | Read (own) | Assigned only | Assigned only |
| Deliverables (Add/Edit) | Full | Read | Assigned only | Assigned only |
| Quotes (Create/Send) | Full | Approve/Reject | Read (assigned scope) | Read (assigned scope) |
| Contracts (MSA/SOW) | Full | Sign/Read | - | - |
| Approvals (Quotes/Overrides/Compliance) | Full | - | Request (Overrides) | - |
| Creators (Manage) | Full | - | Self profile only | - |
| Employees (Manage) | Full | - | - | Self (view role/capacity) |
| Files (Upload/Approve) | Review/Approve | Download | Upload (assigned) | Upload (assigned) |
| Security (Roles/Scopes/2FA) | Full | - | - | - |
| Governance (Versions/Audit) | Full | - | - | - |

- Full: Create/Read/Update/Delete + إجراءات خاصة.
- Read (own): قراءة ضمن نطاق حساب العميل ومشاريعه.
- Assigned only: ضمن المهام/المشاريع المسندة فقط.
- Request (Overrides): تقديم طلبات سعر خاصة دون موافقة ذاتية.
