/** @jsx jsx */
import React from "react";
import { Global, jsx } from "@emotion/core";

import Spinner from "./spinner";
import { Provider as EmployeesProvider } from "../contexts/employees";

const initialEmployees = localStorage.getItem("employees");

const CompanyNameForm = React.lazy(() => import("./company-name-form"));
const EmployeeForm = React.lazy(() => import("./employee-form"));
const Employee = React.lazy(() => import("./employee"));
const Filter = React.lazy(() => import("./filter"));

function App() {
  const [companyName, setCompanyName] = React.useState(
    localStorage.getItem("company-name")
  );

  const [employees, setEmployees] = React.useState(
    initialEmployees ? JSON.parse(initialEmployees) : null
  );

  const [highlightedTitle, setHighlightedTitle] = React.useState("");

  function handleCompanyNameSubmit(name) {
    setCompanyName(name);
    localStorage.setItem("company-name", name);
  }

  function handleCEOFormSubmit({ name }) {
    const id = Date.now();
    const employees = {
      [id]: {
        id,
        name,
        title: "CEO",
        subordinates: []
      }
    };

    setEmployees(employees);
    localStorage.setItem("employees", JSON.stringify(employees));
  }

  function handleNewSubordinate({ name, title, id }) {
    const employeeId = Date.now();
    const newEmployees = {
      ...employees,
      [employeeId]: { id: employeeId, name, title, subordinates: [] },
      [id]: {
        ...employees[id],
        subordinates: employees[id].subordinates.concat(employeeId)
      }
    };
    setEmployees(newEmployees);
    localStorage.setItem("employees", JSON.stringify(newEmployees));
  }

  function handleFilterChange(title) {
    setHighlightedTitle(title);
  }

  const titles = [
    ...new Set(Object.values(employees || {}).map(employee => employee.title))
  ];

  return (
    <EmployeesProvider value={employees}>
      <main
        css={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Global
          styles={{
            body: {
              background: "#fafafa",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
              margin: 0
            }
          }}
        />
        <React.Suspense fallback={<Spinner />}>
          {!companyName && (
            <CompanyNameForm onSubmit={handleCompanyNameSubmit} />
          )}
          {companyName && !employees && (
            <EmployeeForm
              onSubmit={handleCEOFormSubmit}
              companyName={companyName}
              title="CEO"
            />
          )}
          {companyName && employees && (
            <section
              css={{
                minHeight: "100vh",
                width: "100%",
                padding: "3rem",
                boxSizing: "border-box",
                "@media (max-width: 460px)": {
                  padding: "1rem"
                }
              }}
            >
              <Filter
                titles={titles}
                onChange={handleFilterChange}
                value={highlightedTitle}
              />
              <Employee
                {...Object.values(employees).find(
                  employee => employee.title === "CEO"
                )}
                companyName={companyName}
                onNewSubordinate={handleNewSubordinate}
                level={0}
                highlightedTitle={highlightedTitle}
              />
            </section>
          )}
        </React.Suspense>
      </main>
    </EmployeesProvider>
  );
}

export default App;
