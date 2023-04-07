type personType = {
  name: String,
  id: string | number | symbol | undefined,
  avatar: string
}
export type personListType = () => personType[]