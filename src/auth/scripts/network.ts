export const getStoredNetwork = () => {
  return localStorage.getItem("network") ?? "localhost"
}

export const storeNetwork = (network: NetworkName) => {
  localStorage.setItem("network", network)
}
