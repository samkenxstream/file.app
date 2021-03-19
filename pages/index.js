import * as React from "react";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";

import Page from "~/components/Page";

const STYLES_BODY = css`
  font-family: "mono";
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: 960px) {
    display: block;
  }
`;

const STYLES_BODY_LEFT = css`
  width: 488px;
  padding: 24px 0 24px 0;
  flex-shrink: 0;

  @media (max-width: 960px) {
    width: 100%;
  }
`;

const STYLES_BODY_RIGHT = css`
  min-width: 10%;
  width: 100%;
  padding: 24px 0 24px 0;
  border-left: 1px solid #333;

  @media (max-width: 960px) {
    border-left: 0px;
  }
`;

const STYLES_TEXT = css`
  padding: 0px 24px 0px 24px;
`;

const STYLES_TEXT_DESCRIPTION = css`
  padding: 0px 24px 24px 24px;
  color: #acacac;
`;

const STYLES_TEXTILE = css`
  color: #0090ff;
  display: inline-block;
`;

const STYLES_TABLE = css`
  line-height: 12px;
  border: 0px;
  outline: 0px;
  padding: 0px;
  margin: 0px;
  border-top: 1px solid #333;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;

  th {
    padding: 8px 24px 8px 24px;
    border: 0px;
    outline: 0px;
    margin: 0px;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  tr {
    text-align: left;
    border: 0px;
    outline: 0px;
    margin: 0px;
    border-top: 1px solid #333;
  }

  td {
    text-align: left;
    border: 0px;
    outline: 0px;
    margin: 0px;
    padding: 8px 24px 8px 24px;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }
`;

const STYLES_STAT = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid #333;
  padding: 0 0 0 0;
  margin-bottom: 8px;

  &:last-child {
    border-bottom: 0px;
    margin-bottom: 0px;
  }
`;

const STYLES_STAT_LEFT = css`
  flex-shrink: 0;
  margin-bottom: 8px;
`;

const STYLES_STAT_RIGHT = css`
  min-width: 10%;
  width: 100%;
  padding-left: 24px;
  text-align: right;
`;

const P = (props) => <p css={STYLES_TEXT}>{props.children}</p>;
const PG = (props) => <p css={STYLES_TEXT_DESCRIPTION}>{props.children}</p>;
const PT = (props) => <span css={STYLES_TEXTILE}>{props.children}</span>;

export const getServerSideProps = async (context) => {
  return {
    props: { ...context.query },
  };
};

export default class IndexPage extends React.Component {
  _minerMap = {};

  state = {
    miners: [],
    stats: null,
  };

  componentDidMount() {
    console.log(this.props);
    const miners = [];
    let dealCount = 0;
    let minerCount = 0;
    let averageCost = 0;
    const { textile, filrep } = this.props.miners;

    textile.forEach((m) => {
      this._minerMap[m.miner.minerAddr] = {
        deals: m.miner.textile.dealsSummary.total,
        updatedAt: m.miner.textile.dealsSummary.last,
      };
    });

    filrep.forEach((m) => {
      const t = this._minerMap[m.address];

      if (m.storageDeals.total < 1) {
        return;
      } else {
        dealCount = dealCount + Number(m.storageDeals.total);
      }

      if (t && t.deals < 1) {
        return;
      } else {
        if (t) {
          dealCount = dealCount + Number(t.deals);
        }
      }

      if (!m.rawPower) {
        return;
      }

      if (!m.price) {
        return;
      }

      if (!m.freeSpace) {
        return;
      }

      minerCount = minerCount + 1;
      averageCost = averageCost + Number(m.storageDeals.averagePrice);
      miners.push({
        address: m.address,
        space: { free: m.freeSpace, used: m.storageDeals.dataStored },
        iso: m.isoCode,
        region: m.region,
        maxPieceSize: m.maxPieceSize,
        minPieceSize: m.minPieceSize,
        price: m.price,
        verified: m.verifiedPrice,
        averageCost: m.storageDeals.averagePrice,
        power: m.rawPower,
        deals: m.storageDeals.total,
        textile: t ? t : null,
      });
    });

    this.setState({
      miners,
      stats: {
        minerCount: minerCount,
        dealCount: dealCount,
        costFIL: Strings.inFIL(averageCost),
        costUSD: Strings.inUSD(averageCost, this.props.price),
      },
    });
  }

  render() {
    return (
      <Page>
        <div css={STYLES_BODY}>
          <div css={STYLES_BODY_LEFT}>
            <P>FILE.APP</P>
            <PG>Miner Performance, activity, and data.</PG>
            <P>Slingshot Participants</P>
            <PG>Updated on {Strings.toDateSinceEpoch(this.props.epoch)}</PG>
            <table css={STYLES_TABLE}>
              <tbody>
                <tr>
                  <th>CIDs</th>
                  <th>Providers</th>
                  <th>Clients</th>
                </tr>
                <tr>
                  <td>{this.props.total_unique_cids.toLocaleString()}</td>
                  <td>{this.props.total_unique_providers.toLocaleString()}</td>
                  <td>{this.props.total_unique_clients.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <table css={STYLES_TABLE}>
              <tbody>
                <tr>
                  <th>Deals</th>
                  <th>Data</th>
                </tr>
                <tr>
                  <td>{this.props.total_num_deals.toLocaleString()}</td>
                  <td>
                    {this.props.total_stored_data_size.toLocaleString()} BYTES (
                    {Strings.bytesToSize(this.props.total_stored_data_size, 4)})
                  </td>
                </tr>
              </tbody>
            </table>
            <P>Filecoin Plus</P>
            <PG>Updated on {Strings.toDateSinceEpoch(this.props.epoch)}</PG>
            <table css={STYLES_TABLE}>
              <tbody>
                <tr>
                  <th>Deals</th>
                  <th>Data</th>
                </tr>
                <tr>
                  <td>{this.props.filplus_total_num_deals.toLocaleString()}</td>
                  <td>
                    {this.props.filplus_total_stored_data_size.toLocaleString()} BYTES (
                    {Strings.bytesToSize(this.props.filplus_total_stored_data_size, 4)})
                  </td>
                </tr>
              </tbody>
            </table>
            <P>IEX Cloud / FILUSDT</P>
            <PG>Updated on {Strings.toDateSinceEpoch(this.props.epoch)}</PG>
            <table css={STYLES_TABLE}>
              <tbody>
                <tr>
                  <th>Price</th>
                </tr>
                <tr>
                  <td>${this.props.price} USD / 1 FIL</td>
                </tr>
              </tbody>
            </table>
            <P>MINER SOURCES</P>
            <PG>Updated on {Strings.toDateSinceEpoch(this.props.epoch)}</PG>
            <table css={STYLES_TABLE}>
              <tbody>
                <tr>
                  <th>Textile</th>
                  <th>FILREP</th>
                </tr>
                <tr>
                  <td>{this.props.miners.textile.length.toLocaleString()}</td>
                  <td>{this.props.miners.filrep.length.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div css={STYLES_BODY_RIGHT}>
            <P>Filtered Miners</P>
            <PG>
              Updated on {Strings.toDateSinceEpoch(this.props.epoch)}. This list filters out miners
              without successful deals, raw power, price, or free space.
            </PG>

            {this.state.stats ? (
              <table css={STYLES_TABLE}>
                <tbody>
                  <tr>
                    <th>Miners</th>
                    <th>Storage Deals</th>
                    <th>Cost FIL/GB</th>
                    <th>Cost USD/GB</th>
                  </tr>
                  <tr>
                    <td>{this.state.stats.minerCount.toLocaleString()}</td>
                    <td>{this.state.stats.dealCount.toLocaleString()}</td>
                    <td>{this.state.stats.costFIL}</td>
                    <td>{this.state.stats.costUSD}</td>
                  </tr>
                </tbody>
              </table>
            ) : null}

            <table css={STYLES_TABLE}>
              <tbody>
                <tr>
                  <th>Address</th>
                  <th>Location</th>
                  <th>Data</th>
                </tr>
                {this.state.miners.map((each) => {
                  return (
                    <tr key={each.address}>
                      <td>
                        {each.address}
                        {each.textile ? <PT> @TEXTILE-INDEX</PT> : null}
                      </td>
                      <td>
                        {each.region} [{each.iso}]
                      </td>
                      <td>
                        <div css={STYLES_STAT}>
                          <span css={STYLES_STAT_LEFT}>Power</span>
                          <span css={STYLES_STAT_RIGHT}>{Strings.bytesToSize(each.power, 4)}</span>
                        </div>

                        <div css={STYLES_STAT}>
                          <span css={STYLES_STAT_LEFT}>Free Space</span>
                          <span css={STYLES_STAT_RIGHT}>
                            {Strings.bytesToSize(each.space.free, 4)}
                          </span>
                        </div>

                        <div css={STYLES_STAT}>
                          <span css={STYLES_STAT_LEFT}>Used Space</span>
                          <span css={STYLES_STAT_RIGHT}>
                            {Strings.bytesToSize(each.space.used, 4)}
                          </span>
                        </div>

                        <div css={STYLES_STAT}>
                          <span css={STYLES_STAT_LEFT}>Total Deals</span>
                          <span css={STYLES_STAT_RIGHT}>
                            {each.deals}
                            {each.textile ? <PT> ({each.textile.deals} from Textile)</PT> : null}
                          </span>
                        </div>

                        <div css={STYLES_STAT}>
                          <span css={STYLES_STAT_LEFT}>Deal Cost</span>
                          <span css={STYLES_STAT_RIGHT}>
                            {Strings.inFIL(each.price, this.props.price)}
                          </span>
                        </div>

                        <div css={STYLES_STAT}>
                          <span css={STYLES_STAT_LEFT}>Verified Cost</span>
                          <span css={STYLES_STAT_RIGHT}>
                            {Strings.inFIL(each.verifiedPrice, this.props.price)}
                          </span>
                        </div>

                        <div css={STYLES_STAT}>
                          <span css={STYLES_STAT_LEFT}>Average Cost</span>
                          <span css={STYLES_STAT_RIGHT}>
                            {Strings.inFIL(each.averageCost, this.props.price)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Page>
    );
  }
}
