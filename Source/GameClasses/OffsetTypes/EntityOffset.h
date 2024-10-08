#pragma once

#include <cstdint>

#include <CS2/Classes/Entities/C_BaseEntity.h>
#include <Utils/FieldOffset.h>

template <typename FieldType, typename OffsetType>
using EntityOffset = FieldOffset<cs2::C_BaseEntity, FieldType, OffsetType>;

using OffsetToGameSceneNode = EntityOffset<cs2::C_BaseEntity::m_pGameSceneNode, std::int32_t>;
using OffsetToHealth = EntityOffset<cs2::C_BaseEntity::m_iHealth, std::int32_t>;
using OffsetToLifeState = EntityOffset<cs2::C_BaseEntity::m_lifeState, std::int32_t>;
using OffsetToTeamNumber = EntityOffset<cs2::C_BaseEntity::m_iTeamNum, std::int32_t>;
using OffsetToVData = EntityOffset<cs2::C_BaseEntity::m_pSubclassVData, std::int32_t>;
using OffsetToRenderComponent = EntityOffset<cs2::C_BaseEntity::m_pRenderComponent, std::int32_t>;
using OffsetToOwnerEntity = EntityOffset<cs2::C_BaseEntity::m_hOwnerEntity, std::int32_t>;
