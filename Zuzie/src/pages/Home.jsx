import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '/components';

const CampaignDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);



  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default CampaignDetails