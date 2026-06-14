export const ROLES = {
  OFFICER: 'Procurement Officer',
  MANAGER: 'Procurement Manager',
  DIRECTOR: 'Finance Director',
  DEPT_HEAD: 'Department Head',
  WAREHOUSE: 'Warehouse Team'
};

const permissions = {
  [ROLES.OFFICER]: {
    modules: ['/', '/requests', '/orders', '/suppliers', '/catalogue', '/settings'],
    actions: ['CREATE_PR', 'DISPATCH_PO', 'ONBOARD_SUPPLIER', 'ADD_CATALOGUE']
  },
  [ROLES.MANAGER]: {
    modules: ['/', '/requests', '/orders', '/suppliers', '/contracts', '/catalogue', '/reports', '/settings'],
    actions: ['APPROVE_PR_MANAGER', 'REVISE_PO', 'DRAFT_CONTRACT', 'ONBOARD_SUPPLIER', 'ADD_CATALOGUE']
  },
  [ROLES.DIRECTOR]: {
    modules: ['/', '/requests', '/invoices', '/budget', '/contracts', '/reports', '/settings'],
    actions: ['APPROVE_PR_DIRECTOR', 'CAPTURE_INVOICE', 'MATCH_INVOICE', 'SCHEDULE_PAYMENT']
  },
  [ROLES.DEPT_HEAD]: {
    modules: ['/', '/requests', '/budget', '/settings'],
    actions: ['CREATE_PR']
  },
  [ROLES.WAREHOUSE]: {
    modules: ['/', '/goods-receipts', '/inventory', '/orders', '/settings'],
    actions: ['CREATE_GRN', 'RETURN_GRN']
  }
};

export function hasAccess(role, modulePath) {
  if (!role || !permissions[role]) return false;
  return permissions[role].modules.includes(modulePath);
}

export function canPerform(role, action) {
  if (!role || !permissions[role]) return false;
  return permissions[role].actions.includes(action);
}
