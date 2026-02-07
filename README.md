
1 Ha creado `ng g c modales/padre` y `ng g c modales/confirmar-popup`
2 Ha copiado el ejemplo de [PrimeNG](http://primeng.org/confirmpopup#Basic) en el componente confirmar-popup
3 Ha cambiado en el html la funcion `confirm1()` por `confirm2()`
4 Llamar en el html del padre al confirm (acordarse de importarlo)
5 Crear una interfaz `ng g i interfaces/configuracion-popup` y tiene: 

```ts
interface ConfiguracionPopup = {
  message: string,
  header?: string,
  nameButton: string,
  severity: ButtonSeverity
}
```
6 Le ponemos en el `padre.html` a la llamada al componente:
```html
<app-confirmar-popup [config]="parametrosModal">
```
7 Componente confirmar-popup.ts:
```ts
@Input() config!: ConfiguracionPopup
```
8 Componente padre.ts creas un objeto de tipo ConfiguracionPopup para pasarle la data al hijo:
```ts
private parametrosModal: ConfiguracionPopup = {
  message: "Soy el mensaje",
  header?: "Cabezon",
  nameButton: "Cerrar",
  severity: "Danger"
}
```


