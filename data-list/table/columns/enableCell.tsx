import {FC} from 'react'

type Props = {
  enable?: boolean
}

const EnableCell: FC<Props> = ({enable}) => (
  <div className={`badge ${enable ? "badge-light-success" : "badge-light-danger"}`}>{enable ? "啟用中" : "未啟用"}</div>
)

export {EnableCell}
