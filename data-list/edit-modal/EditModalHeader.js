import { KTIcon } from '@/_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import currentTable from '../globalVariable/currentTable'
import dict from '../dictionary/tableDictionary'

const EditModalHeader = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const tableName = currentTable.get()
  const createMode = itemIdForUpdate === null
  const { createHeaderText } = dict

  return (
    <div className='modal-header px-12 justify-content-between'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder m-0'>
        {createMode ? `新增${createHeaderText[tableName]}` : "編輯"}
      </h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => setItemIdForUpdate(undefined)}
        style={{ cursor: 'pointer' }}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export { EditModalHeader }
