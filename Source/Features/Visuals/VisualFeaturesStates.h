#pragma once

#include "PlayerInformationThroughWalls/PlayerInformationThroughWallsState.h"
#include "OutlineGlow/DefuseKitOutlineGlow/DefuseKitOutlineGlowState.h"
#include "OutlineGlow/GrenadeProjectileOutlineGlow/GrenadeProjectileOutlineGlowState.h"
#include "OutlineGlow/PlayerOutlineGlow/PlayerOutlineGlowState.h"
#include "OutlineGlow/WeaponOutlineGlow/WeaponOutlineGlowState.h"
#include "OutlineGlow/OutlineGlowState.h"

struct VisualFeaturesStates {
    PlayerInformationThroughWallsState playerInformationThroughWallsState;
    OutlineGlowState outlineGlowState;
    PlayerOutlineGlowState playerOutlineGlowState;
    WeaponOutlineGlowState weaponOutlineGlowState;
    DefuseKitOutlineGlowState defuseKitOutlineGlowState;
    GrenadeProjectileOutlineGlowState grenadeProjectileOutlineGlowState;
};