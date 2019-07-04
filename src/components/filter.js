/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/core";

import { Card, Select } from "./ui";

class Filter extends React.Component {
  handleSubmit = event => {
    event.preventDefault();
  };

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <Card>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="filter">Highlight employees with title: </label>
          <Select
            id="filter"
            name="filter"
            aria-label="Select a filter"
            onChange={this.handleChange}
            value={this.props.value}
          >
            <option value="">-- Select an title --</option>
            {this.props.titles.map(title => (
              <option value={title} key={title}>
                {title}
              </option>
            ))}
          </Select>
        </form>
      </Card>
    );
  }
}

export default Filter;
