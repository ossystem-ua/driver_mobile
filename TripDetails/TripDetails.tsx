import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native'
import EventsList from './Events'
import { useTheme } from '@/Theme'
import { IDetailedTrip } from '@/Interfaces/Trip'
import { IReference } from '@/Interfaces/Reference'
import { constants } from '@/Config'
import { getStatus } from '@/Services/Trip'
import References from './References'
import Instructions from './Instructions'
import Information from './Information'
import Trailers from './Trailers'
import { MetricsSizes } from '@/Theme/Variables'
import { useTranslation } from 'react-i18next'
import Containers from './Containers'
import { useSelector } from 'react-redux'
import { TripStopStatuses } from '@/Config/Constants'
import { selectAuth } from '@/Store/Auth'
import { getCurrencySymbol } from '@/Services/Helpers'

const { TripRateStatuses, TripStatuses, Permissions } = constants

type Props = {
  data: IDetailedTrip
  referenceData: IReference[] | undefined
  loadData: () => void
  loadReferences: () => void
  dataLoading: boolean
  navigateToEventDetails: (
    guid: string,
    title: string,
    status: TripStopStatuses,
  ) => void
  navigateToShowDocuments: () => void
  navigateToScan: () => void
  showAssignTrailersModal: () => void
  showAcceptTripModal: () => void
  showDeclineTripModal: () => void
  showTripPayModal: () => void
  showCheckInModal: () => void
  openMap: () => void
}

const TripDetails: React.FC<Props> = ({
  data,
  referenceData,
  loadData,
  loadReferences,
  dataLoading,
  navigateToEventDetails,
  navigateToShowDocuments,
  navigateToScan,
  showAssignTrailersModal,
  showAcceptTripModal,
  showDeclineTripModal,
  showTripPayModal,
  showCheckInModal,
  openMap,
}) => {
  const { Gutters, Layout, Common, Colors, Fonts, Images } = useTheme()
  const { data: authData } = useSelector(selectAuth)
  const {
    guid,
    events,
    items,
    containers,
    hazardous,
    specialInstructions,
    temperatureHigh,
    temperatureLow,
    storedTotalDistance,
    storedDeadHeadDistance,
    totalDistanceWithDeadhead,
    status: tripStatus,
    rate,
    rate: { fleetAssignment } = {},
  } = data
  const status = getStatus(data)
  const isContainerChangePossible = [
    TripStatuses.BOOKED,
    TripStatuses.IN_TRANSIT,
  ].includes(tripStatus)

  const { t } = useTranslation()

  const informationData = {
    temperatureHigh,
    temperatureLow,
    items,
    hazardous,
    storedTotalDistance,
    storedDeadHeadDistance,
    totalDistanceWithDeadhead,
  }

  return (
    <ScrollView
      style={[Layout.fullWidth]}
      refreshControl={
        <RefreshControl
          refreshing={dataLoading}
          onRefresh={() => {
            loadData()
            loadReferences()
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          {
            ...Layout.colCenter,
            ...Layout.fill,
            ...Gutters.scale160HPadding,
            ...Gutters.scale200BPadding,
            backgroundColor: Colors.headerColor,
          },
        ]}
      >
        {!!referenceData && !!referenceData.length && (
          <References data={referenceData} />
        )}
        {!!specialInstructions && <Instructions data={specialInstructions} />}
        <Information data={informationData} />
        <View
          style={[
            Layout.row,
            Layout.fullWidth,
            Gutters.scale160TMargin,
            Layout.alignItemsCenter,
          ]}
        >
          <View style={[Layout.row, Layout.fill]}>
            <Text style={[Fonts.labelRegular, { color: Colors.text }]}>
              {t('labels.truck')} #:
              <Text style={Fonts.labelLightBoldRegular}>
                {` ${fleetAssignment?.truck?.unitId}`}
              </Text>
            </Text>
          </View>
        </View>
        <Trailers
          fleetAssignment={fleetAssignment!}
          showAssignTrailersModal={showAssignTrailersModal}
        />
        <Containers
          containers={containers}
          tripGuid={guid}
          isContainerChangePossible={isContainerChangePossible}
        />
        {(authData?.permissions || []).includes(Permissions.TEL_RATE_READ) && (
          <TouchableOpacity
            onPress={showTripPayModal}
            style={[
              Layout.fullWidth,
              Gutters.scale160TMargin,
              Layout.rowCenter,
            ]}
          >
            <Text
              style={[
                Fonts.labelLightBoldRegular,
                { color: Colors.primary, textDecorationLine: 'underline' },
              ]}
            >
              {t('labels.tripPay')}
              {': '}
              {`${getCurrencySymbol(rate.currency)}${
                rate.total ? rate.total.toFixed() : 0
              } ${rate.currency}`}
            </Text>
          </TouchableOpacity>
        )}

        {status === TripRateStatuses.PENDING && (
          <View style={[Layout.row, Layout.fill, Gutters.scale160TMargin]}>
            <TouchableOpacity
              style={[
                Common.button.rounded,
                Layout.fill,
                Gutters.scale180RMargin,
                {
                  padding: MetricsSizes.scale100,
                  height: 'auto',
                  backgroundColor: Colors.acceptButton,
                },
              ]}
              onPress={showAcceptTripModal}
            >
              <Text
                style={[
                  Fonts.labelLightBoldMedium,
                  { color: Colors.buttonText },
                ]}
              >
                {t('actions.accept')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                Common.button.rounded,
                Layout.fill,
                {
                  padding: MetricsSizes.scale100,
                  height: 'auto',
                  backgroundColor: Colors.declineButton,
                },
              ]}
              onPress={showDeclineTripModal}
            >
              <Text
                style={[
                  Fonts.labelLightBoldMedium,
                  { color: Colors.buttonText },
                ]}
              >
                {t('actions.decline')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[Layout.fill, Layout.row, Gutters.scale160TMargin]}>
          {(tripStatus === TripStatuses.BOOKED ||
            tripStatus === TripStatuses.IN_TRANSIT) && (
            <TouchableOpacity
              style={[
                Common.button.rounded,
                Layout.fill,
                Gutters.scale180RMargin,
                {
                  padding: MetricsSizes.scale100,
                  height: 'auto',
                },
              ]}
              onPress={showCheckInModal}
            >
              <Text
                style={[
                  Fonts.labelLightBoldMedium,
                  { color: Colors.buttonText },
                ]}
              >
                {t('actions.checkIn')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              Common.button.outlineRounded,
              Layout.fill,
              {
                padding: MetricsSizes.scale100,
                height: 'auto',
              },
            ]}
            onPress={openMap}
          >
            <Text
              style={[Fonts.labelLightBoldMedium, { color: Colors.primary }]}
            >
              {t('actions.openMap')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {!!events.length && (
        <EventsList data={events} onEventPress={navigateToEventDetails} />
      )}
      <View
        style={[
          Layout.row,
          Layout.fill,
          Gutters.scale160TMargin,
          Gutters.scale160HPadding,
          Gutters.scale160BPadding,
        ]}
      >
        <TouchableOpacity
          style={[
            Common.button.outlineRounded,
            Layout.fill,
            Gutters.scale180RMargin,
            {
              padding: MetricsSizes.scale100,
              height: 'auto',
              backgroundColor: Colors.outlinedRoundedButton,
            },
          ]}
          onPress={navigateToShowDocuments}
        >
          <Text style={[Fonts.labelLightBoldMedium, { color: Colors.primary }]}>
            {t('actions.showDocuments')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Common.button.outlineRounded,
            Layout.fill,
            {
              padding: MetricsSizes.scale100,
              height: 'auto',
              backgroundColor: Colors.outlinedRoundedButton,
            },
          ]}
          onPress={navigateToScan}
        >
          <Text style={[Fonts.labelLightBoldMedium, { color: Colors.primary }]}>
            {t('actions.scan')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default TripDetails
