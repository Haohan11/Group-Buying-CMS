import clsx from 'clsx'
import { FC } from 'react'
import { Row } from 'react-table'
import { User } from '../../core/_models'

type Props = {
  row: Row<User>
}

const CustomRow: FC<Props> = ({ row }) => {
  const { key, ...props } = row.getRowProps()
  return (
    <tr key={key} {...props} >
      {row.cells.map((cell) => {
        const { key, ...props } = cell.getCellProps()
        return (
          <td
            key={key}
            {...props}
          >
            {cell.render('Cell')}
          </td>
        )
      })}
    </tr>
  )
}

export { CustomRow }
