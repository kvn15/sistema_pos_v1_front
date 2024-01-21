
export enum Role {
  Acceso = '00',
  Dashboard = '01',
  Almacen = '02',
  Ventas = '03',
  Compras = '04',
  Reportes = '05',
  Sistema = '06'
}

interface MenuList {
  name: string,
  icon?: string,
  path?: string,
  roles?: string[];
  title: boolean;
  childMenu?: SubMenuList[]
}

interface SubMenuList {
  name: string,
  path: string,
}

export const menu: MenuList[] = [
  {
    name: 'Dashboards',
    icon: 'bx-home-circle',
    path: 'dashboard',
    title: false,
    roles: [ Role.Dashboard ]
  },
  {
    name: 'Almacen',
    title: true,
    roles: [ Role.Almacen ],
  },
  {
    name: 'Categoria',
    icon: 'bx-dock-top',
    path: 'almacen/categoria',
    title: false,
    roles: [ Role.Almacen ],
  },
  {
    name: 'Unidad Medida',
    icon: 'bx-ruler',
    path: 'almacen/unidad-medida',
    title: false,
    roles: [ Role.Almacen ],
  },
  {
    name: 'Compras',
    icon: 'bx-dollar',
    title: false,
    roles: [ Role.Compras ],
    childMenu: [
      {
        name: 'Registrar Proveedor',
        path: 'compras/proveedor'
      },
      {
        name: 'Ingresar Compra',
        path: 'compras/compra-reg'
      },
      {
        name: 'Listar Compra',
        path: 'compras/compra-lista'
      }
    ]
  },
  {
    name: 'Artículos',
    icon: 'bx-collection',
    title: false,
    roles: [ Role.Almacen ],
    childMenu: [
      {
        name: 'Listar Productos',
        path: 'articulos/productos'
      },
      {
        name: 'Agregar Productos',
        path: 'articulos/registro-producto'
      }
    ]
  },
  {
    name: 'Stock / Precios',
    icon: 'bx-list-check',
    path: 'stock-precio',
    title: false,
    roles: [ Role.Almacen ],
  },
  {
    name: 'Venta',
    title: true,
    roles: [ Role.Ventas ],
  },
  {
    name: 'Caja',
    icon: 'bx-lock-open-alt',
    path: 'venta/caja',
    title: false,
    roles: [ Role.Ventas ],
  },
  {
    name: 'POS',
    icon: 'bx-store',
    path: 'venta/pos',
    title: false,
    roles: [ Role.Ventas ],
  },
  {
    name: 'Reportes',
    title: true,
    roles: [ Role.Reportes ],
  },
  {
    name: 'Reportes',
    icon: 'bx-file',
    title: false,
    roles: [ Role.Reportes ],
    childMenu: [
      {
        name: 'Ventas día/mes',
        path: 'reportes/ventas-dia-mes'
      }
    ]
  },
  {
    name: 'Gestion Administrativa',
    title: true,
    roles: [ Role.Acceso, Role.Sistema ],
  },
  {
    name: 'Administración',
    icon: 'bx-user',
    title: false,
    roles: [ Role.Acceso ],
    childMenu: [
      {
        name: 'Registro Usuario',
        path: 'administracion/usuarios'
      },
      {
        name: 'Registro Cliente',
        path: 'administracion/clientes'
      }
    ]
  },
  {
    name: 'Configuración Sunat',
    icon: 'bxs-guitar-amp',
    title: false,
    roles: [ Role.Acceso ],
    childMenu: [
      {
        name: 'Tipo de Comprobantes',
        path: 'sunat/tipo-comprobante'
      },
      {
        name: 'Documento Identidad',
        path: 'sunat/tipo-documento'
      }
    ]
  }
]
