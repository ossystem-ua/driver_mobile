import React from 'react'
import { useTheme } from '@/Theme'
import { Text, TouchableOpacity, View } from 'react-native'
import { IFleetAssignment } from '@/Interfaces/Trip'
import { useTranslation } from 'react-i18next'

type Props = {
  fleetAssignment: Partial<IFleetAssignment>
  showAssignTrailersModal: () => void
}

const Trailers: React.FC<Props> = ({
  fleetAssignment,
  showAssignTrailersModal,
}) => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { trailers } = fleetAssignment
  const { t } = useTranslation()

  return (
    <View style={[Layout.column, Layout.fullWidth, Layout.alignItemsCenter]}>
      <View
        style={[
          Layout.row,
          Layout.fullWidth,
          Gutters.scale160TMargin,
          Layout.alignItemsCenter,
        ]}
      >
        <View style={[Layout.row, Layout.fill, Gutters.scale80RMargin]}>
          <Text style={[Fonts.labelRegular, { color: Colors.text }]}>
            {t('labels.trailer')} #:{' '}
            <Text style={Fonts.labelLightBoldRegular}>
              {!trailers || !trailers.length
                ? `${t('labels.unassigned')}`
                : trailers
                    ?.map(i => i.unitId)
                    .filter(i => !!i)
                    .join(', ')}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[Common.button.outlineRounded, { width: 100 }]}
          onPress={showAssignTrailersModal}
        >
          <Text
            style={[Fonts.labelLightBoldRegular, { color: Colors.primary }]}
          >
            {!trailers || !trailers.length
              ? t('actions.assign')
              : t('actions.change')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Trailers
