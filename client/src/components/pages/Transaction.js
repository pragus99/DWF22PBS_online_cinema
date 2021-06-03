import { useQuery } from "react-query";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { API } from "../service/api";

import Loading from "../../assets/Process.gif";
import ServerError from "../../assets/500 Internal Server Error.gif";

const View = () => {
  let { data, isLoading, error, refetch } = useQuery("adsfaer", async () => {
    const response = await API.get("/transactions/");
    return response.data.data;
  });

  const [approved] = useState("approve");
  const [canceled] = useState("cancel");

  const approve = async (id) => {
    try {
      const body = JSON.stringify({
        status: approved,
      });
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await API.patch(`/transaction/${id}`, body, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = async (id) => {
    try {
      const body = JSON.stringify({
        status: canceled,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await API.patch(`/transaction/${id}`, body, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
      </div>
      {error && (
        <>
          <img src={ServerError} alt="server error. can't fetch data" />
        </>
      )}

      <h1 className="title-table-transaction">Incoming Transactions</h1>
      {data && (
        <div className="table-transaction" responsive="md">
          <Table striped variant="dark">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Users</th>
                <th scope="col">Bukti Transfer</th>
                <th scope="col">Film</th>
                <th scope="col">Number Account</th>
                <th scope="col">Status Payment</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((content, index) => (
                <tr key={content.id + index}>
                  <td>{index + 1}</td>
                  <td>{content.person.fullName}</td>
                  <td>{content.transferProof}</td>
                  <td>{content.film.title}</td>
                  <td>{content.accountNumber}</td>
                  {content.status === "approve" ? (
                    <td className="table-status-success">Approve</td>
                  ) : null}
                  {content.status === "pending" ? (
                    <td className="table-status-pending">Pending</td>
                  ) : null}
                  {content.status === "cancel" ? (
                    <td className="table-status-cancel">Cancel</td>
                  ) : null}
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <label className="arrow-down"></label>
                      </button>
                      <ul
                        className="dropdown-menu arrow-blue"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <form>
                            <input
                              type="hidden"
                              name="status"
                              value={approved}
                            />
                            <label
                              className="table-status-success"
                              htmlFor="status"
                              onClick={() => approve(content.id)}
                            >
                              Approve
                            </label>
                          </form>
                        </li>
                        <li>
                          <form>
                            <input
                              type="hidden"
                              name="status"
                              value={canceled}
                            />
                            <label
                              className="table-status-cancel"
                              htmlFor="status"
                              onClick={() => cancel(content.id)}
                            >
                              Cancel
                            </label>
                          </form>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default View;
