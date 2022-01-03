import * as React from 'react';
import * as Strings from '~/common/strings';

import { css } from '@emotion/react';

import Page from '~/components/Page';
import Loader from '~/components/Loader';

const ONE_GIB = 1073741824;
const ONE_GB = 1000000000;
const AMAZON_MONTHLY = 0.0125;
const AMAZON_MONTHLY_IN_BYTES = AMAZON_MONTHLY / ONE_GB;
const AMAZON_MONTHLY_IN_GIB = AMAZON_MONTHLY_IN_BYTES * 1073741824;

const STYLES_GITHUB = css`
  background: #071908;
  color: #ffffff;
  padding: 8px 24px 8px 24px;
  font-size: 10px;
  font-family: 'Mono';
  text-transform: uppercase;
  display: block;
  text-decoration: none;
  transition: 200ms ease color;

  &:visited {
    color: #ffffff;
  }

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const STYLES_BODY = css`
  font-weight: 400;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  u {
    font-weight: 600;
    text-decoration: none;
  }

  @media (max-width: 1024px) {
    display: block;
  }
`;

const STYLES_H1 = css`
  color: #071908;
  font-size: 1.425rem;
  font-weight: 700;
  padding: 0px 24px 0px 24px;
`;

const STYLES_H2 = css`
  color: rgba(0, 0, 0, 0.8);
  font-size: 1.15rem;
  font-weight: 600;
  padding: 0px 24px 0px 24px;
  margin-top: 24px;
  display: block;
  text-decoration: none;
`;

const STYLES_H2_LINK = css`
  font-size: 1.15rem;
  font-weight: 600;
  padding: 0px 24px 0px 24px;
  margin-top: 24px;
  display: block;
  text-decoration: none;
  color: var(--color-primary);
  transition: 200ms ease opacity;

  &:visited {
    color: var(--color-primary);
  }

  &:hover {
    color: var(--color-primary);
    opacity: 0.8;
  }
`;

const STYLES_H3 = css`
  color: var(--color-primary);
  font-size: 1rem;
  font-weight: 500;
  padding: 0px 24px 0px 24px;
  margin-top: 24px;
`;

const STYLES_LINK = css`
  color: var(--color-primary);
  transition: 200ms ease all;

  :hover {
    opacity: 0.7;
    color: var(--color-primary);
  }

  :visited {
    color: var(--color-primary);
  }
`;

const STYLES_SUBHEADING = css`
  color: var(--color-primary);
  font-weight: 700;
  display: block;
`;

const STYLES_TEXT = css`
  padding: 0px 24px 0px 24px;
  margin-top: 16px;
  max-width: 640px;
  width: 100%;
  line-height: 1.5;

  a {
    text-decoration: none;
    color: var(--color-primary);
    font-weight: 600;
    transition: 200ms ease opacity;

    &:visited {
      color: var(--color-primary);
    }

    &:hover {
      color: var(--color-primary);
      opacity: 0.8;
    }
  }

  @media (max-width: 1024px) {
    max-width: none;
  }
`;

const STYLES_BODY_LEFT = css`
  width: 500px;
  padding: 0 0 24px 0;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const STYLES_BODY_RIGHT = css`
  min-width: 10%;
  width: 100%;
  padding: 0 0 88px 0;
  min-height: 100vh;
  border-left: 1px solid #ececec;

  @media (max-width: 1024px) {
    border-left: 0px;
  }
`;

const STYLES_TABLE = css`
  font-size: 12px;
  font-family: 'Mono';
  border: 0px;
  outline: 0px;
  padding: 0px;
  margin: 0px;
  border-top: 1px solid #ececec;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
  color: rgba(0, 0, 0, 0.8);

  th {
    text-transform: uppercase;
    padding: 8px 24px 8px 24px;
    border: 0px;
    outline: 0px;
    margin: 0px;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    font-weight: 400;
  }

  tr {
    text-align: left;
    border: 0px;
    outline: 0px;
    margin: 0px;
    border-top: 1px solid #ececec;
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
  border-bottom: 1px solid #ececec;
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
  color: #000;

  &:hover {
    color: #000;
  }

  &:visited {
    color: #000;
  }
`;

const STYLES_STAT_RIGHT = css`
  min-width: 10%;
  width: 100%;
  padding-left: 24px;
  text-align: right;
`;

const STYLES_BOX = css`
  min-height: 156px;
  background: rgba(0, 0, 0, 0.02);
  padding-top: 24px;
  border-bottom: 1px solid #ececec;
`;

const H1 = (props) => <h1 css={STYLES_H1} {...props} />;
const H2 = (props) => (props.href ? <a css={STYLES_H2_LINK} {...props} /> : <h2 css={STYLES_H2} {...props} />);
const H3 = (props) => <h2 css={STYLES_H3} {...props} />;
const P = (props) => <p css={STYLES_TEXT} {...props} />;

export const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const getServerSideProps = async (context) => {
  return {
    props: { ...context.query },
  };
};

export default class IndexPage extends React.Component {
  state = {
    miners: [],
  };

  async componentDidMount() {
    await delay(2000);

    this.setState({
      ...this.state,
      miners: this.props.miners,
    });
  }

  render() {
    if (this.props.rebuilding) {
      return (
        <Page>
          <div css={STYLES_BODY}>
            <div css={STYLES_BODY_LEFT}>
              <div css={STYLES_BOX}>
                <H1>file.app</H1>
                <P style={{ marginTop: 4 }}>Rebuilding your data, come back in a few minutes.</P>
              </div>
            </div>
            <div css={STYLES_BODY_RIGHT}>
              <div css={STYLES_BOX}>
                <H1>Want to use Filecoin to store data?</H1>
                <P style={{ marginTop: 4 }}>
                  Check out <a href="https://estuary.tech">https://estuary.tech</a>, our custom Filecoin⇄IPFS node designed to make storing large public data sets easier.
                </P>
              </div>
            </div>
          </div>
        </Page>
      );
    }

    let totalCost = 0;
    let dealCount = 0;
    let dataStored = 0;
    let dataAvailable = 0;

    const minerElements = this.state.miners.length
      ? this.state.miners.map((each) => {
          dataStored = dataStored + Number(each.space.used);
          dataAvailable = dataAvailable + Number(each.space.free);
          dealCount = dealCount + Number(each.deals);
          totalCost = totalCost + Number(each.totalCost);

          return (
            <tr key={each.address}>
              <td>
                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>{each.address}</span>
                </div>
                {each.estuary ? (
                  <div css={STYLES_STAT}>
                    <a css={STYLES_STAT_LEFT} href={`https://estuary.tech/miners/stats/${each.address}`} target="_blank" style={{ fontWeight: 700 }}>
                      View on Estuary
                    </a>
                  </div>
                ) : null}
              </td>
              <td>
                {each.region} [{each.iso}]
              </td>
              <td>
                {each.estuary ? (
                  <div css={STYLES_STAT}>
                    <span css={STYLES_STAT_LEFT}>Version</span>
                    <span css={STYLES_STAT_RIGHT}>{each.estuary.version}</span>
                  </div>
                ) : null}

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>Power</span>
                  <span css={STYLES_STAT_RIGHT}>{Strings.bytesToSize(each.power, 2)}</span>
                </div>

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>Free space</span>
                  <span css={STYLES_STAT_RIGHT}>{Strings.bytesToSize(each.space.free, 2)}</span>
                </div>

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>Used space</span>
                  <span css={STYLES_STAT_RIGHT}>{Strings.bytesToSize(each.space.used, 2)}</span>
                </div>

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>Cost</span>
                  <span css={STYLES_STAT_RIGHT}>{Strings.inFIL(each.price * 2880, this.props.price)} per GiB per day</span>
                </div>

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>Verified cost</span>
                  <span css={STYLES_STAT_RIGHT}>{Strings.inFIL(Number(each.verifiedPrice) > 0 ? each.verifiedPrice * 2880 : 0, this.props.price)} per GiB per day</span>
                </div>

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>Total deal count</span>
                  <span css={STYLES_STAT_RIGHT}>{each.deals ? each.deals : '-'}</span>
                </div>

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>
                    <aside>Average deal cost</aside>
                  </span>
                  <span css={STYLES_STAT_RIGHT}>
                    <aside>{Strings.inFIL(each.totalCost / each.deals, this.props.price)} per deal</aside>
                  </span>
                </div>

                <div css={STYLES_STAT}>
                  <span css={STYLES_STAT_LEFT}>Total storage cost</span>
                  <span css={STYLES_STAT_RIGHT}>{Strings.inFIL(each.totalCost, this.props.price)}</span>
                </div>
              </td>
            </tr>
          );
        })
      : null;

    const averageCost = totalCost / this.state.miners.length;
    const averageAttoFILByByte = averageCost / dataStored;
    const averageAttoFILByGiB = averageAttoFILByByte * 1073741824;

    let storage = {
      day: averageAttoFILByGiB * 2880,
      month: averageAttoFILByGiB * 2880 * 30,
      year: averageAttoFILByGiB * 2880 * 365,
    };

    let averages = {
      day: Strings.inFIL(storage.day, this.props.price),
      month: Strings.inFIL(storage.month, this.props.price),
      year: Strings.inFIL(storage.year, this.props.price),
    };

    const { total_unique_cids = 0, total_unique_providers = 0, total_unique_clients = 0, epoch = 0 } = this.props;

    console.log(this.props);

    return (
      <Page>
        <a css={STYLES_GITHUB} href="https://github.com/application-research/file.app" target="_blank">
          View source on GitHub
        </a>
        <div css={STYLES_BODY}>
          <div css={STYLES_BODY_LEFT}>
            <div css={STYLES_BOX}>
              <H1>file.app</H1>
              <P style={{ marginTop: 4 }}>Filecoin miner analytics</P>
            </div>
            <H2 href="https://storage.filecoin.io" target="_blank">
              storage.filecoin.io
            </H2>
            <P style={{ marginTop: 4 }}>{Strings.toDateSinceEpoch(epoch)}</P>

            <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
              <tbody>
                <tr>
                  <th>CIDs</th>
                  <th>Providers</th>
                  <th>Clients</th>
                </tr>
                <tr>
                  <td>{total_unique_cids.toLocaleString()}</td>
                  <td>{total_unique_providers.toLocaleString()}</td>
                  <td>{total_unique_clients.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <table css={STYLES_TABLE}>
              <tbody>
                <tr>
                  <th>All deals</th>
                  <th>Data</th>
                </tr>
                <tr>
                  <td>{this.props.total_num_deals.toLocaleString()}</td>
                  <td>
                    {this.props.total_stored_data_size.toLocaleString()} Bytes ⇄ <aside>{Strings.bytesToSize(this.props.total_stored_data_size, 4)}</aside>
                  </td>
                </tr>
              </tbody>
            </table>

            <H2 href="https://plus.fil.org" target="_blank">
              plus.fil.org
            </H2>
            <P style={{ marginTop: 4 }}>{Strings.toDateSinceEpoch(epoch)}</P>

            <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
              <tbody>
                <tr>
                  <th>Verified deals</th>
                  <th>Data</th>
                </tr>
                <tr>
                  <td>{this.props.filplus_total_num_deals.toLocaleString()}</td>
                  <td>
                    {this.props.filplus_total_stored_data_size.toLocaleString()} bytes ⇄ <aside>{Strings.bytesToSize(this.props.filplus_total_stored_data_size, 4)}</aside>
                  </td>
                </tr>
              </tbody>
            </table>

            <H2 href="https://estuary.tech" target="_blank">
              estuary.tech
            </H2>
            <P style={{ marginTop: 4 }}>{Strings.toDateSinceEpoch(epoch)}</P>

            <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
              <tbody>
                <tr>
                  <th>Verified deals</th>
                  <th>Files</th>
                  <th>Storage</th>
                </tr>
                <tr>
                  <td>{this.props.estuaryStats.dealsOnChain.toLocaleString()}</td>
                  <td>{this.props.estuaryStats.totalFiles.toLocaleString()}</td>
                  <td>
                    {this.props.estuaryStats.totalStorage.toLocaleString()} bytes ⇄ <aside>{Strings.bytesToSize(this.props.estuaryStats.totalStorage, 4)}</aside>
                  </td>
                </tr>
              </tbody>
            </table>

            {this.props.athena && this.props.athenaResponse ? (
              <React.Fragment>
                <H2 href="https://www.atpool.com/en-US/" target="_blank">
                  atpool.com/en-US/
                </H2>
                <P style={{ marginTop: 4 }}>{Strings.toDateSinceEpoch(epoch)}</P>

                <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
                  <tbody>
                    <tr>
                      <th>Deals</th>
                      <th>Verified</th>
                      <th>Storage</th>
                      <th>Verified</th>
                    </tr>
                    <tr>
                      <td>{this.props.athena.deals.toLocaleString()}</td>
                      <td>{this.props.athena.verifiedDeals.toLocaleString()}</td>
                      <td>
                        <aside>{Strings.bytesToSize(this.props.athena.data, 4)}</aside>
                      </td>
                      <td>
                        <aside>{Strings.bytesToSize(this.props.athena.verifiedData, 4)}</aside>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ) : null}

            <H2 href="https://iexcloud.io" target="_blank">
              iexcloud.io
            </H2>
            <P style={{ marginTop: 4 }}>{Strings.toDateSinceEpoch(epoch)}</P>

            <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
              <tbody>
                <tr>
                  <th>Price</th>
                </tr>
                <tr>
                  <td>${this.props.price} FIL / USDT</td>
                </tr>
              </tbody>
            </table>

            <H2>miners</H2>
            <P style={{ marginTop: 4 }}>Miner sources for our analysis.</P>

            <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
              <tbody>
                <tr>
                  <th>textile.io</th>
                  <th>filrep.io</th>
                  <th>estuary.tech</th>
                  {this.props.athena && this.props.athenaResponse ? <th>atpool</th> : null}
                </tr>
                <tr>
                  <td>{this.props.count.textile}</td>
                  <td>{this.props.count.filrep}</td>
                  <td>{this.props.count.estuary}</td>
                  {this.props.athena && this.props.athenaResponse ? <td>{this.props.count.athena}</td> : null}
                </tr>
              </tbody>
            </table>
          </div>
          <div css={STYLES_BODY_RIGHT}>
            <div css={STYLES_BOX}>
              <H1>Want to use Filecoin to store data?</H1>
              <P style={{ marginTop: 4 }}>
                Check out <a href="https://estuary.tech">https://estuary.tech</a>, our custom Filecoin⇄IPFS node designed to make storing large public data sets easier.
              </P>
            </div>

            {this.state.miners.length ? (
              <React.Fragment>
                <H2>Comparisons</H2>
                <P style={{ marginTop: 4 }}>All prices are based off of these values.</P>

                <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
                  <tbody>
                    <tr>
                      <th>GIB</th>
                      <th>MIB</th>
                      <th>KIB</th>
                      <th>FIL-epoch</th>
                      <th>24 Hours</th>
                    </tr>
                    <tr>
                      <td>1073741824 bytes</td>
                      <td>1048576 bytes</td>
                      <td>1024 bytes</td>
                      <td>30 seconds</td>
                      <td>2880 FIL-epochs</td>
                    </tr>
                  </tbody>
                </table>

                <H2>Average storage cost</H2>
                <P style={{ marginTop: 4 }}>Calculations are based off a FIL-epoch which is 30 seconds. </P>

                <H3>Calculation</H3>
                <P style={{ marginTop: 4 }}>
                  <u>Filecoin cost per byte * 1073741824 = {averageAttoFILByGiB} attoFIL per GiB</u>
                </P>

                <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
                  <tbody>
                    <tr>
                      <th>per GiB per Day</th>
                      <th>
                        per GiB per Month <aside>30 days</aside>
                      </th>
                      <th>per GiB per Year</th>
                      <th>Average deal cost</th>
                    </tr>
                    <tr>
                      <td>{averages.day}</td>
                      <td>{averages.month}</td>
                      <td>{averages.year}</td>
                      <td>
                        {Strings.inFIL(averageCost / dealCount)} ⇄ {Strings.inUSD(averageCost / dealCount, this.props.price)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <H2>Comparison to Amazon S3 - Infrequent Access</H2>
                <P style={{ marginTop: 4 }}>
                  Determining the percentage of how much cheaper or expensive Filecoin storage is compared to Amazon S3 - Infrequent Access tier. That tier costs{' '}
                  <u>$0.0134217728 per GiB per month</u>. Amazon recommends this pricing tier for long lived but infrequently accessed data that needs millisecond access.
                </P>

                <H3>Calculation</H3>
                <P style={{ marginTop: 4 }}>
                  <u>Filecoin cost / Amazon cost = {Strings.percentageCheaper(storage.day, AMAZON_MONTHLY_IN_GIB / 30, this.props.price)}</u>
                </P>

                <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
                  <tbody>
                    <tr>
                      <th>per GiB per day</th>
                      <th>per GiB per month (30 days)</th>
                      <th>per GiB per year</th>
                    </tr>
                    <tr>
                      <td>{Strings.percentageCheaper(storage.day, AMAZON_MONTHLY_IN_GIB / 30, this.props.price)}</td>
                      <td>{Strings.percentageCheaper(storage.month, AMAZON_MONTHLY_IN_GIB, this.props.price)}</td>
                      <td>{Strings.percentageCheaper(storage.year, AMAZON_MONTHLY_IN_GIB * 12, this.props.price)}</td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ) : null}

            <H2>Filtered miners</H2>
            <P style={{ marginTop: 4 }}>Updated on {Strings.toDateSinceEpoch(epoch)}. Requires successful storage deals to be listed.</P>

            <React.Fragment>
              <table css={STYLES_TABLE} style={{ marginTop: 24 }}>
                <tbody>
                  <tr>
                    <th>Miners</th>
                    <th>Total storage deals</th>
                    <th>Total storage size</th>
                    <th>Total available size</th>
                  </tr>
                  <tr>
                    <td>{this.state.miners.length.toLocaleString()}</td>
                    <td>{dealCount.toLocaleString()}</td>
                    <td>{Strings.bytesToSize(dataStored, 2)}</td>
                    <td>{Strings.bytesToSize(dataAvailable, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </React.Fragment>

            {minerElements ? (
              <table css={STYLES_TABLE}>
                <tbody>
                  <tr>
                    <th>Address</th>
                    <th>Location</th>
                    <th>Data</th>
                  </tr>
                  {minerElements}
                </tbody>
              </table>
            ) : (
              <React.Fragment>
                <H2>
                  <Loader />
                </H2>
                <P style={{ marginTop: 4 }}>Loading... There are a lot of miners to show...</P>
              </React.Fragment>
            )}
          </div>
        </div>
      </Page>
    );
  }
}
