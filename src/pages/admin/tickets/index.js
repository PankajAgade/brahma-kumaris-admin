// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

// ** Demo Components Imports
import TableBasic from 'src/views/tables/TableBasic'
import TableDense from 'src/views/tables/TableDense'
import TableSpanning from 'src/views/tables/TableSpanning'
import TableCustomized from 'src/views/tables/TableCustomized'
import TableCollapsible from 'src/views/tables/TableCollapsible'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import { useEffect, useState } from 'react'
import axios from 'axios'

const columns = [
  { id: 'index', label: 'Sr no.', minWidth: 100 },
  { id: 'name', label: 'name', minWidth: 100 },
  {
    id: 'email',
    label: 'Email',
    minWidth: 150,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id: 'mobile',
    label: 'Mobile',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id: 'message',
    label: 'Message',
    minWidth: 170,
    align: 'right',
    format: value => value.toFixed(2)
  }
]

const Tickets = () => {
  const [page, setPage] = useState(0);
  const [pageMaintain, setPageMaintain] = useState(0)
  const [dataGridLoading, setDataGridLoading] = useState(true)

  const [totalCount, setTotalCount] = useState(0)
  const [ticketList, setTicketList] = useState([])

  useEffect(() => {
    setDataGridLoading(true)
    getDataFromServer(false)
  }, [])
  
  useEffect(() => {
    console.log("ticketList -> ", ticketList);
  }, [ticketList])

  async function getDataFromServer(_merge) {
    axios
      .get(`${process.env.BASE_URL}/ticket/get-ticket?page=${page + 1}&limit=11`)
      .then(res => {
        console.log(res)
        if (!totalCount && res.data?.count) {
          setTotalCount(res.data?.count);
        }
        if (_merge) {
          setTicketList(pre => [...pre, ...res.data.data])
        } else {
          setTicketList([...res.data.data])
          setPage(0)
          setPageMaintain(0)
        }
        setDataGridLoading(false)
      })
      .catch(err => {
        // errorToast(err.toString());
        console.error(err)

        setDataGridLoading(false)
      })
  }

  //* call on Next Button
  function getMoreData() {
    setDataGridLoading(true)
    getDataFromServer(true)
  }

  const handleChangePage = (event, newPage) => {
    console.log({ newPage })
    setPageMaintain(newPage)
    if (page < newPage) {
      // * Next When Data need
      setPage(newPage)
      getMoreData()
    } else {
      // *previous
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Contact Us Tickets</Typography>
        {/* <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography> */}
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ticketList.map((m, i) => ({...m, index: i+1})).slice(page * 10, page * 10 + 10)?.map(row => {
                    return (
                      <TableRow hover role='checkbox' tabIndex={-1} key={row.index}>
                        {columns.map(column => {
                          const value = row[column.id]

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10]}
              component='div'
              count={totalCount}
              rowsPerPage={10}
              page={page}
              onPageChange={handleChangePage}
            />
          </Paper>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Tickets
