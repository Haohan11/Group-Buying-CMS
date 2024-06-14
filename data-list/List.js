import { useState } from 'react'

import { ListViewProvider, useListView } from './core/ListViewProvider'
import { TableDataProvider } from './core/tableDataProvider'
import { ListHeader } from './components/header/ListHeader'
import { Table } from './table/Table'
import { EditModal } from './edit-modal/EditModal'
import { Content } from '@/_metronic/layout/components/content'
import dict from './dictionary/tableDictionary'

import currentTable from './globalVariable/currentTable'
import dynamic from "next/dynamic";
import { PageTitle } from "@/_metronic/layout/core";

const { pageTitle: pageTitleDict } = dict

const DynamicToolbarWrapper = dynamic(
  async () => {
    const { ToolbarWrapper } = await import("@/_metronic/layout/components/toolbar");
    return ToolbarWrapper;
  },
  {
    ssr: false,
  }
);

const List = () => {
  const { itemIdForUpdate } = useListView();
  const [trigger, setTrigger] = useState(0);

  return (
    <>
      <div className='px-8'>
        <ListHeader />
        <Table key={trigger} setTrigger={setTrigger}/>
      </div>
      {itemIdForUpdate !== undefined && <EditModal />}
    </>
  )
}

const ListWrapper = () => {
  const tableName = currentTable.get()
  return (
    <>
      <DynamicToolbarWrapper />
      <PageTitle>{pageTitleDict[tableName]}</PageTitle>
      <TableDataProvider>
      <ListViewProvider>
        <Content>
          <List />
        </Content>
      </ListViewProvider>
      </TableDataProvider>
    </>

  )
}

export default ListWrapper

