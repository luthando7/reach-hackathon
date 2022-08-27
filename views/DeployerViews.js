import React from "react";
import PlayerViews from "./PlayerViews";

const exports = { ...PlayerViews };

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div class="row">
        <div class="column blue vertical-center">
          <h2>The amount you are claiming</h2>
          <p>The actual claim amount you are looking to get</p>
        </div>
        <div class="column">
          <div class="vertical-center">
            <div className="Deployer">
              <h2>Deployer (Client)</h2>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

exports.SetWager = class extends React.Component {
  render() {
    const { parent, defaultWager, standardUnit } = this.props;
    const wager = (this.state || {}).wager || defaultWager;
    return (
      <div>
        <input
          type="number"
          placeholder={defaultWager}
          onChange={(e) => this.setState({ wager: e.currentTarget.value })}
        />{" "}
        {standardUnit}
        <br />
        <button onClick={() => parent.setWager(wager)}>Set claim</button>
      </div>
    );
  }
};

exports.Deploy = class extends React.Component {
  render() {
    const { parent, wager, standardUnit } = this.props;
    return (
      <div>
        Claim (pay to deploy): <strong>{wager}</strong> {standardUnit}
        <br />
        <button onClick={() => parent.deploy()}>Deploy</button>
      </div>
    );
  }
};

exports.Deploying = class extends React.Component {
  render() {
    return <div>Deploying... please wait.</div>;
  }
};

exports.WaitingForAttacher = class extends React.Component {
  async copyToClipboard(button) {
    const { ctcInfoStr } = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = "Copied!";
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const { ctcInfoStr } = this.props;
    return (
      <div>
        Waiting for Insurer to join...
        <br /> Please give them this contract info:
        <pre className="ContractInfo">{ctcInfoStr}</pre>
        <button onClick={(e) => this.copyToClipboard(e.currentTarget)}>
          Copy to clipboard
        </button>
      </div>
    );
  }
};

export default exports;
