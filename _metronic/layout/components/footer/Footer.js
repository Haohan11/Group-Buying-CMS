import copyRightText from '@/tool/copyright'

const Footer = () => {
  return (
    <>
      <div className='text-gray-900 order-2 order-md-1'>
        <span className='text-muted fw-semibold me-1'>
          {copyRightText}
        </span>
      </div>
    </>
  )
}

export { Footer }
