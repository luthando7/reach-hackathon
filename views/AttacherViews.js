import React from "react";
import PlayerViews from "./PlayerViews";

const exports = { ...PlayerViews };

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div class="row">
        <div class="column blue vertical-center">
          <p>The claim you are looking at</p>
        </div>
        <div class="column">
          <div className="Attacher">
            <h2>Attacher (Insurer)</h2>
            {content}
          </div>
        </div>
      </div>
    );
  }
};

exports.Attach = class extends React.Component {
  render() {
    const { parent } = this.props;
    const { ctcInfoStr } = this.state || {};
    return (
      <div>
        Please paste the contract info of the client to attach to:
        <br />
        <textarea
          spellCheck="false"
          className="ContractInfo"
          onChange={(e) => this.setState({ ctcInfoStr: e.currentTarget.value })}
          placeholder="{}"
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >
          Attach
        </button>
      </div>
    );
  }
};

exports.Attaching = class extends React.Component {
  render() {
    return <div>Attaching, please wait...</div>;
  }
};

exports.AcceptTerms = class extends React.Component {
  render() {
    const { wager, standardUnit, parent } = this.props;
    const { disabled } = this.state || {};
    return (
      <div>
        The claim amount is:
        <br /> Claim: {wager} {standardUnit}
        <br />
        <button
          disabled={disabled}
          onClick={() => {
            this.setState({ disabled: true });
            parent.termsAccepted();
          }}
        >
          Accept the claim amount
        </button>
      </div>
    );
  }
};

exports.WaitingForTurn = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for the other player...
        <br />
        Think about which move you want to play.
      </div>
    );
  }
};

export default exports;
