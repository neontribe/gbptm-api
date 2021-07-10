import React from 'react';
import { Helmet } from 'react-helmet';
import queryString from 'query-string';
import { mutate } from 'swr';
// import { loader } from 'graphql.macro';
import { print } from 'graphql/language/printer';

import PageLayout from '../../components/PageLayout';
import EntryForm from '../../components/EntryForm';
import Box from '../../components/Box';
import Spacer from '../../components/Spacer';
import Button from '../../components/Button';
import LocationSearch from '../../components/LocationSearch';

import { useMapState } from '../../components/MapState';
import useNearbyLoos from '../../components/useNearbyLoos';

import config from '../../config';
import { useMutation } from '../../graphql/fetcher';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';

// const FIND_LOO_BY_ID_QUERY = print(loader('../graphql/findLooById.graphql'));
// const UPDATE_LOO_MUTATION = print(loader('../graphql/updateLoo.graphql'));

const initialFormState = {
  active: null,
  noPayment: true,
};

const AddPage = (props) => {
  const [mapState, setMapState] = useMapState();
  const LooMap = React.useMemo(() => dynamic(() => import('../../components/LooMap'), { loading: () => <p>Loading map...</p>, ssr: false, }), [])
  const { data } = useNearbyLoos({
    lat: mapState.center.lat,
    lng: mapState.center.lng,
    radius: mapState.radius,
  });

  const router = useRouter();

  const { lat, lng } = router.query;

  // set the map position if lat and lng query params are present
  React.useEffect(() => {
    if (lat && lng) {
      setMapState({
        center: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      });
    }
  }, [lat, lng, setMapState]);

  // const [
  //   updateLoo,
  //   { data: saveData, loading: saveLoading, error: saveError },
  // ] = useMutation(UPDATE_LOO_MUTATION);

  const save = async (formData: { active: boolean; }) => {
    // add the active state for which there's no user-facing form control as yet
    formData.active = true;

    try {
      const data = await updateLoo(formData);

      mutate(
        [
          FIND_LOO_BY_ID_QUERY,
          JSON.stringify({ id: data.submitReport.loo.id }),
        ],
        {
          loo: data.submitReport.loo,
        }
      );
    } catch (err) {
      console.error('save error', err);
    }
  };

  // redirect to new toilet entry page on successful addition
  // if (saveData) {
  //   return (
  //     <Redirect to={`/loos/${saveData.submitReport.loo.id}?message=created`} />
  //   );
  // }

  return (
    <PageLayout>
      <Helmet>
        <title>{config.getTitle('Add Toilet')}</title>
      </Helmet>

      <Box position="relative" display="flex" height="40vh">
        <LooMap
          loos={data}
          center={mapState.center}
          zoom={mapState.zoom}
          minZoom={config.editMinZoom}
          showCenter
          showContributor
          showSearchControl
          showLocateControl
          showCrosshair
          controlsOffset={20}
          withAccessibilityOverlays={false}
          onViewportChanged={setMapState}
        />

        <Box position="absolute" top={0} left={0} m={3}>
          <LocationSearch
            onSelectedItemChange={(center) => setMapState({ center })}
          />
        </Box>
      </Box>

      <Spacer mt={4} />

      <EntryForm
        title="Add This Toilet"
        loo={initialFormState}
        center={mapState.center}
        // saveLoading={saveLoading}
        // saveError={saveError}
        onSubmit={save}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button type="submit" data-testid="add-the-toilet">
            Save toilet
          </Button>
        </Box>
      </EntryForm>

      <Spacer mt={4} />
    </PageLayout>
  );
};

export default AddPage;
