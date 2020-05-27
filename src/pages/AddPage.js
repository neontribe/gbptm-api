import React from 'react';
import queryString from 'query-string';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';

import PageLayout from '../components/PageLayout';
import LooMap from '../components/LooMap';
import EntryForm from '../components/EntryForm';
import Box from '../components/Box';
import Spacer from '../components/Spacer';
import Button from '../components/Button';
import LocationSearch from '../components/LocationSearch';

import useMapPosition from '../components/useMapPosition';
import useNearbyLoos from '../components/useNearbyLoos';

import config from '../config';

const UPDATE_LOO = loader('./updateLoo.graphql');

const initialFormState = {
  active: null,
  noPayment: true,
};

const AddPage = (props) => {
  const [mapPosition, setMapPosition] = useMapPosition(config.fallbackLocation);

  const { data } = useNearbyLoos({
    variables: {
      lat: mapPosition.center.lat,
      lng: mapPosition.center.lng,
      radius: mapPosition.radius,
    },
  });

  const { lat, lng } = queryString.parse(props.location.search);

  // set the map position if lat and lng query params are present
  React.useEffect(() => {
    if (lat && lng) {
      setMapPosition({
        center: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      });
    }
  }, [lat, lng, setMapPosition]);

  const [
    updateLoo,
    { loading: saveLoading, data: saveResponse, error: saveError },
  ] = useMutation(UPDATE_LOO);

  if (saveError) {
    console.error('saving', saveError);
  }

  const save = (data) => {
    // add the active state for which there's no user-facing form control as yet
    data.active = true;

    updateLoo({
      variables: data,
    });
  };

  return (
    <PageLayout>
      <Box position="relative" display="flex" height={332} maxHeight="40vh">
        <LooMap
          loos={data}
          center={mapPosition.center}
          zoom={mapPosition.zoom}
          minZoom={config.editMinZoom}
          showCenter
          showContributor
          showSearchControl
          showLocateControl
          showCrosshair
          controlsOffset={20}
        />

        <Box position="absolute" top={0} left={0} m={3}>
          <LocationSearch
            onSelectedItemChange={(center) => setMapPosition({ center })}
          />
        </Box>
      </Box>

      <Box position="relative" mt={-3} pt={4} borderRadius={35} bg="white">
        <EntryForm
          title="Add This Toilet"
          loo={initialFormState}
          center={mapPosition.center}
          saveLoading={saveLoading}
          saveResponse={saveResponse}
          saveError={saveError}
          onSubmit={save}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button type="submit" data-testid="add-the-toilet">
              Save toilet
            </Button>
          </Box>
        </EntryForm>
      </Box>

      <Spacer mt={4} />
    </PageLayout>
  );
};

export default AddPage;
