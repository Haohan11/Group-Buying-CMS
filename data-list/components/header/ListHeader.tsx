import {useListView} from '../../core/ListViewProvider'
import {DataListToolbar} from './DataListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {ListSearchComponent} from './ListSearchComponent'

const ListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='d-flex justify-content-between card-header border-0 pt-6'>
      <ListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <DataListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {ListHeader}
