import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { View, Text, Image } from 'react-native'
import { useTheme } from '@/Theme'
import { selectConfig } from '@/Store/User'
import { tripConfigConstants } from '@/Config'
import { IDetailedTrip } from '@/Interfaces/Trip'
import {
  formatDistance,
  getTemperatureType,
  normalizeTemperatureRange,
} from '@/Services/Helpers'
import {
  calculateTotalQuantity,
  calcItemsTotalWeightWithoutQty,
} from '@/Services/Helpers/getTotalQuantityAndWeight'
//////////////////////////////////////////////////

type Props = {
  data: Partial<IDetailedTrip>
}

const Information: React.FC<Props> = ({ data }) => {
  const { Gutters, Layout, Colors, Images, Fonts, MetricsSizes } = useTheme()
  const {
    items,
    hazardous,
    temperatureLow,
    temperatureHigh,
    storedTotalDistance,
    storedDeadHeadDistance,
    totalDistanceWithDeadhead,
  } = data

  const { t } = useTranslation()
  const { configs } = useSelector(selectConfig).data || {}
  const quantityAndType = calculateTotalQuantity(items || [])
  const weightAndType = calcItemsTotalWeightWithoutQty(items || [])
  const {
    DropdownOptionName: { GENERAL_UOM_CALC_DEFAULT_UOM_SYSTEM },
  } = tripConfigConstants
  const defaultUomSystemValue = (configs || []).find(
    (config: { [key: string]: any }) =>
      config.name === GENERAL_UOM_CALC_DEFAULT_UOM_SYSTEM,
  )

  const { value, inheritedValue } = defaultUomSystemValue || {}
  const uomSystem = value || inheritedValue
  const uomTemperature =
    (temperatureLow || temperatureHigh) &&
    normalizeTemperatureRange(temperatureLow, temperatureHigh, null, uomSystem)

  const weight =
    typeof weightAndType.weight === 'number'
      ? weightAndType.weight.toFixed(1)
      : weightAndType.weight

  return (
    <>
      <View style={[Gutters.scale160TMargin, Layout.row]}>
        {items.length !== 0 && (
          <View style={[Layout.fill, Layout.row, Layout.alignItemsEnd]}>
            <Image style={Gutters.scale80RMargin} source={Images.icons.cube} />
            <Text style={[Fonts.labelRegular, { color: Colors.text }]}>
              Items:
              <Text
                style={[Fonts.labelLightBoldRegular, { color: Colors.text }]}
              >
                {` ${weight} ${weightAndType.weightType}`},{' '}
                {quantityAndType.quantity} {quantityAndType.packageType}
              </Text>
            </Text>
          </View>
        )}
        <View style={Layout.row}>
          {(typeof temperatureLow === 'number' ||
            typeof temperatureHigh === 'number') && (
            <>
              <Image
                style={{
                  width: MetricsSizes.scale160,
                  height: MetricsSizes.scale160,
                }}
                source={
                  Images.icons[
                    getTemperatureType(temperatureLow || temperatureHigh)
                  ]
                }
              />
              <Text
                style={[
                  {
                    ...Fonts.labelRegular,
                    color:
                      Colors[
                        getTemperatureType(temperatureLow || temperatureHigh)
                      ],
                  },
                ]}
              >
                {uomTemperature}
              </Text>
            </>
          )}
          {!!hazardous && <Image source={Images.icons.toxic} />}
        </View>
      </View>
      <View
        style={[
          Layout.row,
          Layout.wrap,
          Layout.fullWidth,
          Gutters.scale120TMargin,
          Layout.justifyContentBetween,
        ]}
      >
        {typeof storedTotalDistance === 'number' && (
          <View style={[Layout.row, Gutters.scale20RMargin]}>
            <Text style={[Fonts.labelRegular, { color: Colors.text }]}>
              {`${t('labels.loaded')}: `}
              <Text
                style={[Fonts.labelLightBoldRegular, { color: Colors.text }]}
              >
                {`${formatDistance(storedTotalDistance, uomSystem)}`}
              </Text>
            </Text>
          </View>
        )}
        {typeof storedDeadHeadDistance === 'number' && (
          <View style={[Layout.row, Gutters.scale20RMargin]}>
            <Text style={[Fonts.labelRegular, { color: Colors.text }]}>
              {`${t('labels.empty')}: `}
              <Text
                style={[Fonts.labelLightBoldRegular, { color: Colors.text }]}
              >
                {`${formatDistance(storedDeadHeadDistance, uomSystem)}`}
              </Text>
            </Text>
          </View>
        )}
        {typeof totalDistanceWithDeadhead === 'number' && (
          <View style={Layout.row}>
            <Text style={[Fonts.labelRegular, { color: Colors.text }]}>
              {`${t('labels.total')}: `}
              <Text
                style={[Fonts.labelLightBoldRegular, { color: Colors.text }]}
              >
                {`${formatDistance(totalDistanceWithDeadhead, uomSystem)}`}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </>
  )
}

export default Information
