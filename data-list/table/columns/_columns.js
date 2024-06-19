import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserTwoStepsCell } from './UserTwoStepsCell'
import { ActionsCell } from './ActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { ColorsCell } from './ColorsCell'
import { ColorSchemeCell } from './ColorSchemeCell'
import {
  User, Products, Series, ColorScheme, Design, Material, Supplier, Account, Role, Environment
} from '../../core/_models'
import { EnableCell } from './enableCell'
import { ProductAvaliableCell } from './ProductAvaliableCell'

const usersColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  // {
  //   Header: (props) => <UserSelectionHeader tableProps={props} />,
  //   id: 'selection',
  //   Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  // },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    id: 'name',
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Role' className='min-w-125px' />,
    accessor: 'role',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Last login' className='min-w-125px' />
    ),
    id: 'last_login',
    Cell: ({ ...props }) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Two steps' className='min-w-125px' />
    ),
    id: 'two_steps',
    Cell: ({ ...props }) => <UserTwoStepsCell two_steps={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
    ),
    accessor: 'joined_day',
  },
]

export const placeHolderColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <ProductAvaliableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='編號' className='min-w-125px' />,
    accessor: 'code',
  },
]

export const stockColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='上架狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <ProductAvaliableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='商品型號' className='min-w-125px' />,
    accessor: 'code',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='商品樣式' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品系列' className='min-w-125px' />
    ),
    accessor: 'series.name',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='供應商' className='min-w-125px' />
    ),
    accessor: 'supplier.name',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品顏色' className='min-w-125px' />
    ),
    id: "colors",
    Cell: ({ ...props }) => <ColorsCell colorList={props.data[props.row.index].colorList} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='色系類別' className='min-w-125px' />
    ),
    accessor: 'colorScheme',
    Cell: ({ ...props }) => <ColorSchemeCell colorScheme={props.data[props.row.index].colorScheme} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='面料材質' className='min-w-125px' />
    ),
    accessor: 'material',
    Cell: ({ ...props }) => <ColorSchemeCell colorScheme={props.data[props.row.index].material} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品風格' className='min-w-125px' />
    ),
    accessor: 'design',
    Cell: ({ ...props }) => <ColorSchemeCell colorScheme={props.data[props.row.index].design} />,
  },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='適用場景' className='min-w-125px' />
  //   ),
  //   accessor: 'environment',
  //   Cell: ({ ...props }) => <ColorSchemeCell colorScheme={props.data[props.row.index].environment} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='遮光效果' className='min-w-125px' />
    ),
    accessor: 'block',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='吸音效果' className='min-w-125px' />
    ),
    accessor: 'absorption',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品描述' className='min-w-125px' />
    ),
    accessor: 'description',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='創建時間' className='min-w-125px' />
    ),
    accessor: 'create_time',
  },
]

export const seriesColumns= [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='系列編號' className='min-w-125px' />,
    accessor: 'code',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='系列名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comment',
  },
]

export const colorColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='顏色名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comment',
  },
]

export const colorSchemeColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='色系名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comment',
  },
]

export const designColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='風格名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comment',
  },
]

export const materialColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='面料名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comment',
  },
]

export const supplierColumns= [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='供應商編號' className='min-w-125px' />,
    accessor: 'code',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='供應商名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comment',
  },
]

export const accountsColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='員工角色' className='min-w-125px' />,
    accessor: 'role_name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='員工編號' className='min-w-125px' />,
    accessor: 'code',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='員工姓名' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='身分證號' className='min-w-125px' />,
    accessor: 'id_code',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='手機號碼' className='min-w-125px' />,
    accessor: 'phone_number',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='電子郵箱' className='min-w-125px' />,
    accessor: 'email',
  },
]

export const roleColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='角色名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comment',
  },
]

export const environmentColumns = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='上架狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <ProductAvaliableCell enable={props.data[props.row.index].enable} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='場景名稱' className='min-w-125px' />,
    accessor: 'name',
  },
]
