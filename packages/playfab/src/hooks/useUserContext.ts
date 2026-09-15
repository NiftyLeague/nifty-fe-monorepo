import { useContext } from 'solid-js'
import { UserContext } from '../components/UserContextProvider'

export function useUserContext() {
  return useContext(UserContext)!
}

export default useUserContext
