import React from "react";
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
  integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
  crossorigin="anonymous"
></link>;

const exports = {};

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div className="App">
        <header className="App-header" id="root">
          <p>Insurance DApp</p>
          <ul>
            <li>
              <a href="#">profile</a>
            </li>
            <li className="active">
              <a href="#">services</a>
            </li>
            <li>
              <a href="#">about</a>
            </li>
          </ul>
        </header>
        {content}
      </div>
    );
  }
};

exports.ConnectAccount = class extends React.Component {
  render() {
    return (
      <div>
        Please wait while we connect to your account. If this takes more than a
        few seconds, there may be something wrong.
      </div>
    );
  }
};

exports.FundAccount = class extends React.Component {
  render() {
    const { bal, standardUnit, defaultFundAmt, parent } = this.props;
    const amt = (this.state || {}).amt || defaultFundAmt;
    return (
      <div>
        <div class="row">
          <div class="column blue vertical-center">
            <h2>Claim insurance and get a pay-out in crypto</h2>
            <p>
              This is an easy tool for insurers to pay claims out in crypto
              Try it out...
            </p>
          </div>
          <div class="column">
            <div class="vertical-center">
              <h2>Submit a claim</h2>
              <p>
                Please enter the highest amount you can claim {standardUnit}?
              </p>
              <input
                type="number"
                placeholder={defaultFundAmt}
                onChange={(e) => this.setState({ amt: e.currentTarget.value })}
              />
              <button onClick={() => parent.fundAccount(amt)}>
                Start claim
              </button>
              {/* <button onClick={() => parent.skipFundAccount()}>Skip</button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

exports.DeployerOrAttacher = class extends React.Component {
  render() {
    const { parent } = this.props;
    return (
      <div class="row">
        <div class="column blue vertical-center">
          <h2>Which party are you?</h2>
          <p>Are you claiming the from an insurer or are you looking to payout some claims?</p>
        </div>
        <div class="column">
          <div class="vertical-center">
            <div>
              Please select a role:
              <br />
              <p>
                <button onClick={() => parent.selectDeployer()}>Client</button>
                <br /> Set the claim amount, deploy the contract.
              </p>
              <p>
                <button onClick={() => parent.selectAttacher()}>Insurer</button>
                <br /> Attach to the claim's contract.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default exports;
