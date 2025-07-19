import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    user: types.maybe(types.frozen()),
    session: types.maybe(types.frozen()),
    userRole: types.maybe(types.string),
    isLoading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken && !!store.session
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setUser(user: any) {
      store.user = user
    },
    setSession(session: any) {
      store.session = session
    },
    setUserRole(role: string) {
      store.userRole = role
    },
    setIsLoading(loading: boolean) {
      store.isLoading = loading
    },
    setError(error?: string) {
      store.error = error
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
      store.user = undefined
      store.session = undefined
      store.userRole = undefined
      store.error = undefined
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
