/** @jsx jsx */
import React from "react";
import { createPortal } from "react-dom";
import { jsx } from "@emotion/core";
import { FaPlus } from "react-icons/fa";

import { Card, Modal } from "./ui";
import Spinner from "./spinner";

import EmployeesContext from "../contexts/employees";

const EmployeeForm = React.lazy(() => import("./employee-form"));

function Employee({
  id,
  name,
  title,
  level,
  companyName,
  subordinates,
  highlightedTitle,
  onNewSubordinate
}) {
  const employees = React.useContext(EmployeesContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  function handleOpenClick() {
    setIsModalOpen(true);
  }

  function handleSubmit(subordinate) {
    onNewSubordinate({ ...subordinate, id });
    setIsModalOpen(false);
  }

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "Escape" || !isModalOpen) return;
      setIsModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const isHighlighted = highlightedTitle === title;

  const $portal = React.useMemo(() => {
    let $portal = document.getElementById("portal");
    if (!$portal) {
      $portal = document.createElement("div");
      $portal.setAttribute("id", "portal");
      document.body.appendChild($portal);
    }
    return $portal;
  }, []);

  return (
    <div>
      <Card
        id={id}
        css={{
          display: "inline-block",
          padding: "1rem 3rem",
          width: "auto",
          position: "relative",
          backgroundColor: isHighlighted ? "#028265" : "white",
          color: isHighlighted ? "white" : "black"
        }}
      >
        <button
          aria-label={`Add new employee under ${name}`}
          onClick={handleOpenClick}
          css={{
            background: "none",
            border: "none",
            color: isHighlighted ? "white" : "black",
            cursor: "pointer",
            position: "absolute",
            top: ".5rem",
            right: ".5rem",
            outline: "none"
          }}
        >
          <FaPlus />
        </button>
        <h2
          css={{
            fontSize: "1rem",
            fontWeight: "bold",
            margin: "0",
            marginBottom: ".5rem"
          }}
        >
          {name}
        </h2>
        {title && (
          <h3
            css={{
              fontSize: ".8rem",
              fontWeight: "lighter",
              margin: "0"
            }}
          >
            Title: <strong>{title}</strong>
          </h3>
        )}
      </Card>
      <section css={{ margin: `1rem 0 0 3rem` }}>
        {subordinates
          .map(subordinate => employees[subordinate])
          .map(employee => (
            <Employee
              key={employee.id}
              {...employee}
              level={level + 1}
              companyName={companyName}
              onNewSubordinate={onNewSubordinate}
              highlightedTitle={highlightedTitle}
            />
          ))}
      </section>
      {isModalOpen &&
        createPortal(
          <Modal>
            <React.Suspense fallback={<Spinner />}>
              <EmployeeForm companyName={companyName} onSubmit={handleSubmit} />
            </React.Suspense>
          </Modal>,
          $portal
        )}
    </div>
  );
}

export default Employee;
