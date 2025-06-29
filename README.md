# Wifi App

This a GUI for NetworkManager to manage networks

## Environment Variables

- These are the environment variable set to run application for hyprland and arch

  ```
  __NV_DISABLE_EXPLICIT_SYNC=1
  GDK_BACKEND=x11
  WEBKIT_DISABLE_DMABUF_RENDERER=1
  NM_SECRET_AGENT=no
  ```

- To get rid of white screen
  - `move react.svg to public folder`

## Development

To run in development mode clone repo and run

```
bun install && bun tauri dev
```

## Build

To build the project

```
bun tauri build
```
