import clsx from 'clsx'
import { useRouter } from 'next/router'

const TablePagination = ({ totalPages }) => {
  const router = useRouter()
  const { page } = router.query
  const currentPage = parseInt(page) || 1

  const pushPageToUrl = (toPage) => router.push({ query: { ...router.query, page: toPage } })

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <div id='kt_table_users_paginate'>
          <ul className='pagination'>
            <li
              className={clsx('page-item', {
                disabled: currentPage === 1,
              })}
            >
              <a
                onClick={() => pushPageToUrl(1)}
                style={{ cursor: 'pointer' }} className='page-link'>
                First
              </a>
            </li>
            {totalPages !== null && Array(totalPages).fill().map((_, index) => index + 1).map(page =>
              <li
                key={page}
                className={clsx('page-item', {
                  active: page === currentPage,
                })}
              >
                <a
                  className={clsx('page-link')}
                  onClick={() => pushPageToUrl(page)}
                  style={{ cursor: 'pointer' }}
                >
                  {page}
                </a>
              </li>
            )}
            <li
              className={clsx('page-item', {
                disabled: currentPage === totalPages,
              })}
            >
              <a
                onClick={() => pushPageToUrl(totalPages)}
                style={{ cursor: 'pointer' }}
                className='page-link'
              >
                Last
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export { TablePagination }
