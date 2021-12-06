import React, { useMemo, useEffect, useState } from 'react'
import Web3 from 'web3'
import { CronosChimps, Chimp } from 'cronoschimp-utils'

const Chimps = ({ account }: { account: string }) => {
  const web3 = useMemo(() => new Web3(window.ethereum), [])

  const [chimps, setChimps] = useState<Chimp[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getChimps() {
      const cronosChimps = new CronosChimps(web3);
  
      const chimpsOfUser = await cronosChimps.getChimpsByOwner(account);

      for (let i = 0; i < chimpsOfUser.length; i++) {
        await chimpsOfUser[i].fetchMetadata();
      }

      setChimps(chimpsOfUser);
      setLoading(false);
    }

    getChimps();
  }, [account, web3])

  const handleTransfer = async (id: number) => {
    const user = prompt("Please enter the user you would like to transfer to");

    if (user) {
      const chimp = chimps[id];

      await chimp.transfer(account, user).send({
        from: account
      });

      alert('sent!')
    } else {
      alert('Please enter a user')
    }
  }

  return (
    <div>
      <h1>Your Chimps</h1>
      {
        loading && (
          <div>Loading Data</div>
        )
      }
      {
        !loading && !chimps.length && (
          <div>You do not have any chimps</div>
        )
      }
      {
        !loading && chimps.length && (
          <table>
            <tbody>
              <tr>
                <th>Chimp Id</th>
                <th>Honorary</th>
                <th>Image Url</th>
                <th>attributes</th>
                <th></th>
              </tr>
              {
                chimps.map((chimp, index) => (
                  <tr key={chimp.id}>
                    <td>
                      {chimp.id}
                    </td>
                    <td>
                      {chimp.isHonorary.toString()}
                    </td>
                    <td>
                      {chimp.metadata?.image}
                    </td>
                    <td>
                      {
                        (chimp.metadata?.attributes || []).map(({ trait_type, value }) => (
                          <div key={trait_type}>{trait_type}: {value}</div>
                        ))
                      }
                    </td>
                    <td>
                      <button onClick={() => handleTransfer(index)}>Transfer</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )
      }
    </div>
  )
}

export default Chimps
