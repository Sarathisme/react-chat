import {Component} from "react";
import React from "react";

class SearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "users": this.props.results
        }
    }

    render() {
        return (
            <ul className="list-group">
                {
                    Object.values(JSON.parse(this.state.users)).map((user) =>
                        <li key={ user.id } id={ user.id } className="list-group-item d-flex justify-content-between align-items-center" onClick={this.props.onItemClick}>
                            { user.name }
                        </li>
                    )}
            </ul>
        );
    }
}

export default SearchResults;