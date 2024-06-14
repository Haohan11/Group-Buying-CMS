import {useQuery} from 'react-query'
import {EditModalForm} from './EditModalForm'
import {isNotEmpty, QUERIES} from '@/_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'

const EditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery = isNotEmpty(itemIdForUpdate)
  // const {
  //   isLoading,
  //   data: user,
  //   error,
  // } = useQuery(
  //   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
  //   () => {
  //     return getUserById(itemIdForUpdate)
  //   },
  //   {
  //     cacheTime: 0,
  //     enabled: enabledQuery,
  //     onError: (err) => {
  //       setItemIdForUpdate(undefined)
  //       console.error(err)
  //     },
  //   }
  // )

  return <EditModalForm />

  if (!itemIdForUpdate) {
    return <EditModalForm isUserLoading={isLoading} user={{id: undefined}} />
  }

  if (!isLoading && !error && user) {
    return <EditModalForm isUserLoading={isLoading} user={user} />
  }

  return null
}

export {EditModalFormWrapper}
