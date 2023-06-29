import Link from "next/link"

export default ({ currentUser }) => {
  return <nav className="navbar navbar-light bg-light px-3">
    <Link className="navbar-brand" href="/">
      GitTix
    </Link>
    <div className="d-flex justify-content-end">
      <ul className="nav justify-content-around align-items-center">

        {currentUser ?
          <>
            <Link href="/tickets/new" className="nav-link">
              Sell Tickets
            </Link>
            <Link href="/orders" className="nav-link">
              My Orders
            </Link>
            <Link href="/auth/signout" className="nav-link">
              Sign Out
            </Link></>

          :
          <>
            <Link className="nav-link" href="/auth/signin">
              Sign In
            </Link>
            <Link className="nav-link" href="/auth/signup">
              Sign Up
            </Link>

          </>}
      </ul>
    </div>
  </nav >


}