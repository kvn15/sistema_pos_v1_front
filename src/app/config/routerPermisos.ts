import { Role, menu } from "./menu"

export const routerPermiso = (permiso: string[]) => {
  if (permiso.includes(Role.Dashboard)) {
    return '/'
  } else {
    const pathPadre = menu.filter( m => m.title === false && m.roles!.includes(permiso[0]) )[0]
    if (typeof pathPadre.path === 'undefined') {
      return pathPadre.childMenu![0].path;
    }
    return pathPadre.path
  }
}
