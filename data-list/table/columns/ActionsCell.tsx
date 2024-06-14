
import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '@/_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '@/_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteUser} from '../../core/_requests'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


type Props = {
  id: ID
}

const ActionsCell: FC<Props> = ({id}) => {
  const {setItemIdForUpdate} = useListView()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
  }

  const deleteItem = useMutation(() => deleteUser(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
    },
  })

  return (
    <>
      <DropdownButton
        size="sm"
        variant="secondary"
        title="操作"
        id={`dropdown-button-drop-0`}
        key={0}
      >
        {/* <Dropdown.Item eventKey="1">Action</Dropdown.Item> */}
        <Dropdown.Item  onClick={openEditModal} >編輯</Dropdown.Item>
        {/* <Dropdown.Item eventKey="3">Something else here</Dropdown.Item> */}
        {/* <Dropdown.Divider /> */}
        {/* <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
      </DropdownButton>
      {/*       
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        操作
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>

      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            編輯
          </a>
        </div>
        
      </div>      
      */}
    </>
  )
  {/* <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={async () => await deleteItem.mutateAsync()}
          >
            刪除
          </a>
        </div> */}
}

export {ActionsCell}
