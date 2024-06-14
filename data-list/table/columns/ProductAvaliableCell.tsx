import {FC} from 'react'

type Props = {
  enable?: boolean
}

const ProductAvaliableCell: FC<Props> = ({enable}) => (
  <div className={`badge ${enable ? "badge-light-success" : "badge-light-danger"}`}>{enable ? "已上架" : "未上架"}</div>
)

export {ProductAvaliableCell}
