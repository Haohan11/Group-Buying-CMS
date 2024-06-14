import { KTIcon } from '@/_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { UsersListFilter } from './UsersListFilter'
import { useRouter } from 'next/router'

import { usePermission } from '@/tool/hooks'

const DataListToolbar = () => {
  const { setItemIdForUpdate } = useListView()
  const openAddModal = () => {
    setItemIdForUpdate(null)
  }

  const router = useRouter();
  const permission = usePermission();

  const show = (() => {
    if (!router || !permission) return false;

    if (router.asPath.includes("stock") && !permission?.stock?.modify) return false
    if (router.asPath.includes("environment") && !permission?.environment?.modify) return false
    if (router.asPath.includes("employee") && !permission?.account?.modify) return false

    return true;
  })()

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <UsersListFilter />

      {
        show &&
        <button type='button' className='btn btn-primary' onClick={openAddModal}>
          <KTIcon iconName='plus' className='fs-2' />
          新增
        </button>
      }
    </div>
  )
}

export { DataListToolbar }
